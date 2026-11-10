module Local exposing
    ( Extra
    , Kind(..)
    , decoder
    , encode
    , nonConsecutiveViolations
    , violations
    )

{-| Regras locais: termômetros, setas, pontos kropki, X/V e linhas.

Espelha `backend/sudoku/extras.pl`. Lá cada regra vira restrições
CLP(FD); aqui cada regra vira uma função pura que olha o tabuleiro
(possivelmente incompleto) e devolve as células em conflito.

O tipo `Kind` separa o que no JSON é "tipo + parâmetro": um ponto kropki
é `WhiteDot` ou `BlackDot`, nunca "kropki com cor desconhecida". Estados
inválidos não são representáveis, e o decoder é quem garante isso.

-}

import Json.Decode as D
import Json.Encode as E


type Kind
    = ThermoLine
    | ArrowLine
    | WhiteDot
    | BlackDot
    | XSum
    | VSum
    | WhisperLine
    | RenbanLine
    | PalindromeLine
    | BetweenLine


type alias Extra =
    { kind : Kind
    , cells : List Int
    }



-- JSON: {"type": "kropki", "cells": [3, 4], "param": "white"}


decoder : D.Decoder Extra
decoder =
    D.map3 (\t p cells -> ( t, p, cells ))
        (D.field "type" D.string)
        (D.oneOf [ D.field "param" paramDecoder, D.succeed NoParam ])
        (D.field "cells" (D.list D.int))
        |> D.andThen
            (\( t, p, cells ) ->
                case kindOf t p of
                    Just kind ->
                        if List.isEmpty cells then
                            D.fail "regra local sem células"

                        else
                            D.succeed { kind = kind, cells = cells }

                    Nothing ->
                        D.fail ("regra local desconhecida: " ++ t)
            )


type Param
    = NoParam
    | Text String
    | Number Int


paramDecoder : D.Decoder Param
paramDecoder =
    D.oneOf
        [ D.map Text D.string
        , D.map Number D.int
        , D.null NoParam
        ]


kindOf : String -> Param -> Maybe Kind
kindOf t p =
    case ( t, p ) of
        ( "thermo", _ ) ->
            Just ThermoLine

        ( "arrow", _ ) ->
            Just ArrowLine

        ( "kropki", Text "white" ) ->
            Just WhiteDot

        ( "kropki", Text "black" ) ->
            Just BlackDot

        ( "xv", Number 10 ) ->
            Just XSum

        ( "xv", Number 5 ) ->
            Just VSum

        ( "whisper", _ ) ->
            Just WhisperLine

        ( "renban", _ ) ->
            Just RenbanLine

        ( "palindrome", _ ) ->
            Just PalindromeLine

        ( "between", _ ) ->
            Just BetweenLine

        _ ->
            Nothing


encode : Extra -> E.Value
encode extra =
    let
        ( t, param ) =
            case extra.kind of
                ThermoLine ->
                    ( "thermo", E.null )

                ArrowLine ->
                    ( "arrow", E.null )

                WhiteDot ->
                    ( "kropki", E.string "white" )

                BlackDot ->
                    ( "kropki", E.string "black" )

                XSum ->
                    ( "xv", E.int 10 )

                VSum ->
                    ( "xv", E.int 5 )

                WhisperLine ->
                    ( "whisper", E.null )

                RenbanLine ->
                    ( "renban", E.null )

                PalindromeLine ->
                    ( "palindrome", E.null )

                BetweenLine ->
                    ( "between", E.null )
    in
    E.object
        [ ( "type", E.string t )
        , ( "cells", E.list E.int extra.cells )
        , ( "param", param )
        ]



-- VERIFICAÇÃO
-- `look i` é o dígito da célula i (ou Nothing se vazia). Todas as
-- verificações aceitam tabuleiro incompleto: só reclamam do que já dá
-- para saber que está errado.


violations : (Int -> Maybe Int) -> Extra -> List Int
violations look extra =
    let
        cells =
            extra.cells

        pairOk ok =
            case cells of
                [ a, b ] ->
                    case ( look a, look b ) of
                        ( Just x, Just y ) ->
                            if ok x y then
                                []

                            else
                                cells

                        _ ->
                            []

                _ ->
                    []

        neighbours ok =
            List.map2 Tuple.pair cells (List.drop 1 cells)
                |> List.concatMap
                    (\( a, b ) ->
                        case ( look a, look b ) of
                            ( Just x, Just y ) ->
                                if ok x y then
                                    []

                                else
                                    [ a, b ]

                            _ ->
                                []
                    )
    in
    case extra.kind of
        ThermoLine ->
            thermo look cells

        ArrowLine ->
            arrow look cells

        WhiteDot ->
            pairOk (\x y -> abs (x - y) == 1)

        BlackDot ->
            pairOk (\x y -> x == 2 * y || y == 2 * x)

        XSum ->
            pairOk (\x y -> x + y == 10)

        VSum ->
            pairOk (\x y -> x + y == 5)

        WhisperLine ->
            neighbours (\x y -> abs (x - y) >= 5)
                ++ List.filter (\i -> look i == Just 5) cells

        RenbanLine ->
            renban look cells

        PalindromeLine ->
            List.map2 Tuple.pair cells (List.reverse cells)
                |> List.concatMap
                    (\( a, b ) ->
                        case ( look a, look b ) of
                            ( Just x, Just y ) ->
                                if x == y then
                                    []

                                else
                                    [ a, b ]

                            _ ->
                                []
                    )

        BetweenLine ->
            between look cells


{-| Entre as posições i < j do termômetro, o valor sobe pelo menos j - i.
-}
thermo : (Int -> Maybe Int) -> List Int -> List Int
thermo look cells =
    let
        n =
            List.length cells

        filled =
            List.indexedMap Tuple.pair cells
                |> List.filterMap (\( k, i ) -> Maybe.map (\v -> ( k, i, v )) (look i))

        badPair ( k, _, v ) ( j, _, w ) =
            k < j && w - v < j - k

        bad (( k, i, v ) as x) =
            if v < k + 1 || v > 9 - (n - 1 - k) || List.any (\y -> badPair x y || badPair y x) filled then
                Just i

            else
                Nothing
    in
    List.filterMap bad filled


arrow : (Int -> Maybe Int) -> List Int -> List Int
arrow look cells =
    case cells of
        circle :: shaft ->
            let
                values =
                    List.filterMap look shaft

                s =
                    List.sum values

                empties =
                    List.length shaft - List.length values

                wrong =
                    case look circle of
                        Just c ->
                            if empties == 0 then
                                s /= c

                            else
                                s + empties > c

                        Nothing ->
                            s + empties > 9
            in
            if wrong then
                cells

            else
                []

        [] ->
            []


renban : (Int -> Maybe Int) -> List Int -> List Int
renban look cells =
    let
        values =
            List.filterMap look cells

        repeated =
            List.length values /= List.length (unique values)
    in
    case ( List.maximum values, List.minimum values ) of
        ( Just hi, Just lo ) ->
            if repeated || hi - lo > List.length cells - 1 then
                cells

            else
                []

        _ ->
            []


between : (Int -> Maybe Int) -> List Int -> List Int
between look cells =
    case ( cells, List.reverse cells ) of
        ( first :: _, last :: _ ) ->
            let
                middle =
                    cells |> List.drop 1 |> List.reverse |> List.drop 1
            in
            case ( look first, look last ) of
                ( Just x, Just y ) ->
                    let
                        lo =
                            min x y

                        hi =
                            max x y

                        outside i =
                            case look i of
                                Just v ->
                                    v <= lo || v >= hi

                                Nothing ->
                                    lo + 1 >= hi
                    in
                    if List.any outside middle then
                        cells

                    else
                        []

                _ ->
                    []

        _ ->
            []


{-| Regra global não-consecutivo: vizinhas lado a lado não podem ser
números seguidos.
-}
nonConsecutiveViolations : (Int -> Maybe Int) -> List Int
nonConsecutiveViolations look =
    List.range 0 80
        |> List.concatMap
            (\i ->
                let
                    right =
                        if modBy 9 i < 8 then
                            [ i + 1 ]

                        else
                            []

                    down =
                        if i < 72 then
                            [ i + 9 ]

                        else
                            []
                in
                (right ++ down)
                    |> List.concatMap
                        (\j ->
                            case ( look i, look j ) of
                                ( Just x, Just y ) ->
                                    if abs (x - y) == 1 then
                                        [ i, j ]

                                    else
                                        []

                                _ ->
                                    []
                        )
            )


unique : List comparable -> List comparable
unique =
    List.foldl
        (\x acc ->
            if List.member x acc then
                acc

            else
                x :: acc
        )
        []
