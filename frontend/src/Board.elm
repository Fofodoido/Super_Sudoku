module Board exposing
    ( Board
    , Cell
    , applyEliminations
    , autoNotes
    , candidates
    , cell
    , clearCell
    , conflicts
    , digitCount
    , fromPuzzle
    , isFull
    , matchesSolution
    , setValue
    , toggleNote
    , values
    )

{-| Estado do tabuleiro do jogador e as regras verificáveis localmente.

O Elm conhece a geometria de todas as variantes, então detecta conflitos
(dígitos repetidos entre vizinhos, paridade violada, soma de gaiola
estourada) sem precisar consultar o servidor.

-}

import Array exposing (Array)
import Dict
import Local
import Set exposing (Set)
import Variant exposing (Geometry, Rule(..))


type alias Cell =
    { value : Int
    , given : Bool
    , notes : Set Int
    }


type alias Board =
    Array Cell


emptyCell : Cell
emptyCell =
    { value = 0, given = False, notes = Set.empty }


fromPuzzle : List Int -> Board
fromPuzzle puzzle =
    puzzle
        |> List.map (\v -> { value = v, given = v > 0, notes = Set.empty })
        |> Array.fromList


cell : Int -> Board -> Cell
cell i board =
    Array.get i board |> Maybe.withDefault emptyCell


values : Board -> List Int
values board =
    Array.toList board |> List.map .value


valueAt : Board -> Int -> Int
valueAt board i =
    (cell i board).value


peersOf : Geometry -> Int -> Set Int
peersOf geo i =
    Array.get i geo.peers |> Maybe.withDefault Set.empty


{-| Coloca um dígito e remove-o das anotações de todos os vizinhos.
-}
setValue : Geometry -> Int -> Int -> Board -> Board
setValue geo i digit board =
    let
        c =
            cell i board

        placed =
            Array.set i { c | value = digit, notes = Set.empty } board
    in
    if c.given then
        board

    else
        Set.foldl
            (\j b ->
                let
                    pc =
                        cell j b
                in
                Array.set j { pc | notes = Set.remove digit pc.notes } b
            )
            placed
            (peersOf geo i)


clearCell : Int -> Board -> Board
clearCell i board =
    let
        c =
            cell i board
    in
    if c.given then
        board

    else
        Array.set i { c | value = 0, notes = Set.empty } board


toggleNote : Int -> Int -> Board -> Board
toggleNote i digit board =
    let
        c =
            cell i board
    in
    if c.given || c.value /= 0 then
        board

    else if Set.member digit c.notes then
        Array.set i { c | notes = Set.remove digit c.notes } board

    else
        Array.set i { c | notes = Set.insert digit c.notes } board


{-| Remove candidatos indicados por uma dica (só em células já anotadas).
-}
applyEliminations : List ( Int, Int ) -> Board -> Board
applyEliminations elims board =
    List.foldl
        (\( i, d ) b ->
            let
                c =
                    cell i b
            in
            Array.set i { c | notes = Set.remove d c.notes } b
        )
        board
        elims


parityAllows : Int -> Int -> Bool
parityAllows mark digit =
    case mark of
        1 ->
            modBy 2 digit == 1

        2 ->
            modBy 2 digit == 0

        _ ->
            True


{-| Candidatos de uma célula vazia segundo as regras visíveis.
-}
candidates : Geometry -> Array Int -> Board -> Int -> Set Int
candidates geo parity board i =
    if valueAt board i /= 0 then
        Set.empty

    else
        let
            used =
                peersOf geo i
                    |> Set.toList
                    |> List.map (valueAt board)
                    |> Set.fromList

            mark =
                Array.get i parity |> Maybe.withDefault 0

            cageOk d =
                case Dict.get i geo.cageOf |> Maybe.andThen (\k -> Array.get k geo.cages) of
                    Nothing ->
                        True

                    Just cage ->
                        let
                            filled =
                                cage.cells |> List.map (valueAt board) |> List.sum

                            emptyOthers =
                                cage.cells |> List.filter (\j -> j /= i && valueAt board j == 0) |> List.length
                        in
                        filled + d + emptyOthers <= cage.sum

            -- Regras locais e não-consecutivo: "finge" que a célula vale d e
            -- vê se alguma regra reclama.
            localOk d =
                let
                    look j =
                        if j == i then
                            Just d

                        else
                            lookup board j
                in
                List.all (\e -> not (List.member i e.cells) || List.isEmpty (Local.violations look e)) geo.extras
                    && (not (List.member NonConsecutive geo.rules)
                            || List.all (\j -> lookup board j /= Just (d - 1) && lookup board j /= Just (d + 1)) (orthogonal i)
                       )
        in
        List.range 1 9
            |> List.filter (\d -> not (Set.member d used) && parityAllows mark d && cageOk d && localOk d)
            |> Set.fromList


autoNotes : Geometry -> Array Int -> Board -> Board
autoNotes geo parity board =
    Array.indexedMap
        (\i c ->
            if c.value == 0 then
                { c | notes = candidates geo parity board i }

            else
                c
        )
        board


{-| Células envolvidas em alguma violação visível das regras.
-}
conflicts : Geometry -> Array Int -> Board -> Set Int
conflicts geo parity board =
    let
        duplicates =
            List.range 0 80
                |> List.filter
                    (\i ->
                        let
                            v =
                                valueAt board i
                        in
                        v /= 0 && Set.foldl (\j acc -> acc || valueAt board j == v) False (peersOf geo i)
                    )

        parityErrors =
            List.range 0 80
                |> List.filter
                    (\i ->
                        let
                            v =
                                valueAt board i
                        in
                        v /= 0 && not (parityAllows (Array.get i parity |> Maybe.withDefault 0) v)
                    )

        cageErrors =
            geo.cages
                |> Array.toList
                |> List.concatMap
                    (\cage ->
                        let
                            vs =
                                List.map (valueAt board) cage.cells

                            total =
                                List.sum vs

                            full =
                                List.all (\v -> v /= 0) vs
                        in
                        if total > cage.sum || (full && total /= cage.sum) then
                            cage.cells

                        else
                            []
                    )
        localErrors =
            List.concatMap (Local.violations (lookup board)) geo.extras

        nonConsecutive =
            if List.member NonConsecutive geo.rules then
                Local.nonConsecutiveViolations (lookup board)

            else
                []
    in
    Set.fromList (duplicates ++ parityErrors ++ cageErrors ++ localErrors ++ nonConsecutive)


{-| O dígito da célula, se houver (0 vira Nothing).
-}
lookup : Board -> Int -> Maybe Int
lookup board i =
    case valueAt board i of
        0 ->
            Nothing

        v ->
            Just v


orthogonal : Int -> List Int
orthogonal i =
    [ ( -1, 0 ), ( 1, 0 ), ( 0, -1 ), ( 0, 1 ) ]
        |> List.filterMap
            (\( dr, dc ) ->
                let
                    r =
                        Variant.row i + dr

                    c =
                        Variant.col i + dc
                in
                if r >= 0 && r <= 8 && c >= 0 && c <= 8 then
                    Just (r * 9 + c)

                else
                    Nothing
            )


digitCount : Board -> Int -> Int
digitCount board digit =
    Array.foldl
        (\c n ->
            if c.value == digit then
                n + 1

            else
                n
        )
        0
        board


isFull : Board -> Bool
isFull board =
    Array.toList board |> List.all (\c -> c.value /= 0)


matchesSolution : Array Int -> Board -> Bool
matchesSolution solution board =
    values board == Array.toList solution
