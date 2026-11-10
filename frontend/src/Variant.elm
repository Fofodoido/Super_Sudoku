module Variant exposing
    ( Cage
    , Geometry
    , Rule(..)
    , allRules
    , boxOf
    , col
    , geometry
    , isDiagonal
    , isLocal
    , isWindow
    , kingNeighbors
    , knightNeighbors
    , row
    , ruleDescription
    , ruleFromId
    , ruleId
    , ruleName
    )

{-| Geometria do tabuleiro para cada combinação de regras.

Espelha `backend/sudoku/geometry.pl`: o Prolog usa esta geometria para
gerar e explicar puzzles, e o Elm a usa para detectar conflitos, montar
anotações automáticas e desenhar o tabuleiro.

-}

import Array exposing (Array)
import Dict exposing (Dict)
import Local exposing (Extra)
import Set exposing (Set)


type Rule
    = Diagonal
    | Hyper
    | AntiKnight
    | Killer
    | Parity
    | AntiKing
    | Disjoint
    | NonConsecutive
    | Thermo
    | Arrow
    | Kropki
    | XV
    | Whisper
    | Renban
    | Palindrome
    | Between


allRules : List Rule
allRules =
    [ Diagonal
    , Hyper
    , AntiKnight
    , AntiKing
    , Disjoint
    , NonConsecutive
    , Killer
    , Parity
    , Thermo
    , Arrow
    , Kropki
    , XV
    , Whisper
    , Renban
    , Palindrome
    , Between
    ]


{-| Regras locais: desenhadas pelo Prolog sobre algumas células a partir
da solução (como as gaiolas do Killer).
-}
isLocal : Rule -> Bool
isLocal rule =
    List.member rule [ Killer, Parity, Thermo, Arrow, Kropki, XV, Whisper, Renban, Palindrome, Between ]


ruleId : Rule -> String
ruleId rule =
    case rule of
        Diagonal ->
            "diagonal"

        Hyper ->
            "hyper"

        AntiKnight ->
            "antiknight"

        Killer ->
            "killer"

        Parity ->
            "parity"

        AntiKing ->
            "antiking"

        Disjoint ->
            "disjoint"

        NonConsecutive ->
            "nonconsecutive"

        Thermo ->
            "thermo"

        Arrow ->
            "arrow"

        Kropki ->
            "kropki"

        XV ->
            "xv"

        Whisper ->
            "whisper"

        Renban ->
            "renban"

        Palindrome ->
            "palindrome"

        Between ->
            "between"


ruleFromId : String -> Maybe Rule
ruleFromId id =
    case id of
        "diagonal" ->
            Just Diagonal

        "hyper" ->
            Just Hyper

        "antiknight" ->
            Just AntiKnight

        "killer" ->
            Just Killer

        "parity" ->
            Just Parity

        _ ->
            List.head (List.filter (\r -> ruleId r == id) allRules)


ruleName : Rule -> String
ruleName rule =
    case rule of
        Diagonal ->
            "Diagonal (X)"

        Hyper ->
            "Hyper (janelas)"

        AntiKnight ->
            "Anti-cavalo"

        Killer ->
            "Killer (gaiolas)"

        Parity ->
            "Par / Ímpar"

        AntiKing ->
            "Anti-rei"

        Disjoint ->
            "Disjunto"

        NonConsecutive ->
            "Não-consecutivo"

        Thermo ->
            "Termômetros"

        Arrow ->
            "Setas"

        Kropki ->
            "Kropki (pontos)"

        XV ->
            "X e V"

        Whisper ->
            "Sussurro"

        Renban ->
            "Renban"

        Palindrome ->
            "Palíndromo"

        Between ->
            "Entre-pontas"


ruleDescription : Rule -> String
ruleDescription rule =
    case rule of
        Diagonal ->
            "As duas diagonais principais também contêm 1 a 9 sem repetição."

        Hyper ->
            "Quatro janelas 3×3 extras (sombreadas) também contêm 1 a 9."

        AntiKnight ->
            "Células a um salto de cavalo de xadrez nunca têm o mesmo dígito."

        Killer ->
            "Gaiolas tracejadas: dígitos distintos cuja soma é o número no canto."

        Parity ->
            "Círculo = dígito ímpar, quadrado = dígito par."

        AntiKing ->
            "Células vizinhas na diagonal nunca têm o mesmo dígito."

        Disjoint ->
            "Células na mesma posição de cada bloco 3×3 não se repetem."

        NonConsecutive ->
            "Células lado a lado nunca têm números seguidos."

        Thermo ->
            "Os números sobem a partir do bulbo do termômetro."

        Arrow ->
            "O número do círculo é a soma das células da haste."

        Kropki ->
            "Ponto branco: números seguidos. Ponto preto: um é o dobro do outro."

        XV ->
            "X: as duas células somam 10. V: somam 5."

        Whisper ->
            "Vizinhos na linha verde diferem de pelo menos 5."

        Renban ->
            "A linha roxa tem números seguidos, em qualquer ordem."

        Palindrome ->
            "A linha cinza-azulada se lê igual nos dois sentidos."

        Between ->
            "As células do meio ficam entre os números dos dois círculos."


type alias Cage =
    { sum : Int
    , cells : List Int
    }


type alias Geometry =
    { rules : List Rule
    , houses : List (List Int)
    , peers : Array (Set Int)
    , cages : Array Cage
    , cageOf : Dict Int Int
    , extras : List Extra
    }


row : Int -> Int
row i =
    i // 9


col : Int -> Int
col i =
    modBy 9 i


boxOf : Int -> Int
boxOf i =
    (row i // 3) * 3 + col i // 3


range : Int -> Int -> List Int
range a b =
    List.range a b


rows : List (List Int)
rows =
    List.map (\r -> List.map (\c -> r * 9 + c) (range 0 8)) (range 0 8)


cols : List (List Int)
cols =
    List.map (\c -> List.map (\r -> r * 9 + c) (range 0 8)) (range 0 8)


square : Int -> Int -> List Int
square r0 c0 =
    List.concatMap (\dr -> List.map (\dc -> (r0 + dr) * 9 + c0 + dc) (range 0 2)) (range 0 2)


boxes : List (List Int)
boxes =
    List.map (\b -> square ((b // 3) * 3) (modBy 3 b * 3)) (range 0 8)


diagonals : List (List Int)
diagonals =
    [ List.map (\k -> k * 10) (range 0 8)
    , List.map (\k -> k * 8) (range 1 9)
    ]


{-| Regra disjunto: a mesma posição relativa dentro de cada bloco.
-}
disjointGroups : List (List Int)
disjointGroups =
    List.map
        (\k ->
            List.concatMap
                (\br -> List.map (\bc -> (br * 3 + k // 3) * 9 + bc * 3 + modBy 3 k) (range 0 2))
                (range 0 2)
        )
        (range 0 8)


windows : List (List Int)
windows =
    List.map (\( r, c ) -> square r c) [ ( 1, 1 ), ( 1, 5 ), ( 5, 1 ), ( 5, 5 ) ]


isDiagonal : Int -> Bool
isDiagonal i =
    row i == col i || row i + col i == 8


isWindow : Int -> Bool
isWindow i =
    let
        inBand x =
            (x >= 1 && x <= 3) || (x >= 5 && x <= 7)
    in
    inBand (row i) && inBand (col i)


knightNeighbors : Int -> List Int
knightNeighbors =
    offsets [ ( 1, 2 ), ( 2, 1 ), ( -1, 2 ), ( -2, 1 ), ( 1, -2 ), ( 2, -1 ), ( -1, -2 ), ( -2, -1 ) ]


kingNeighbors : Int -> List Int
kingNeighbors =
    offsets [ ( 1, 1 ), ( 1, -1 ), ( -1, 1 ), ( -1, -1 ) ]


offsets : List ( Int, Int ) -> Int -> List Int
offsets moves i =
    moves
        |> List.filterMap
            (\( dr, dc ) ->
                let
                    r =
                        row i + dr

                    c =
                        col i + dc
                in
                if r >= 0 && r <= 8 && c >= 0 && c <= 8 then
                    Just (r * 9 + c)

                else
                    Nothing
            )


geometry : List Rule -> List Cage -> List Extra -> Geometry
geometry rules cages extras =
    let
        has r =
            List.member r rules

        houses =
            rows
                ++ cols
                ++ boxes
                ++ (if has Diagonal then
                        diagonals

                    else
                        []
                   )
                ++ (if has Hyper then
                        windows

                    else
                        []
                   )
                ++ (if has Disjoint then
                        disjointGroups

                    else
                        []
                   )

        groups =
            houses ++ List.map .cells cages

        groupPeers i =
            groups
                |> List.filter (List.member i)
                |> List.concat

        knight i =
            if has AntiKnight then
                knightNeighbors i

            else
                []

        king i =
            if has AntiKing then
                kingNeighbors i

            else
                []

        peerSet i =
            (groupPeers i ++ knight i ++ king i)
                |> Set.fromList
                |> Set.remove i

        cageOf =
            cages
                |> List.indexedMap (\k cage -> List.map (\c -> ( c, k )) cage.cells)
                |> List.concat
                |> Dict.fromList
    in
    { rules = rules
    , houses = houses
    , peers = Array.initialize 81 peerSet
    , cages = Array.fromList cages
    , cageOf = cageOf
    , extras = extras
    }
