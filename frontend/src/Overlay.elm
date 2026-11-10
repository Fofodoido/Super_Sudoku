module Overlay exposing (view)

{-| Desenho das regras locais (termômetros, setas, pontos, linhas) em SVG,
por cima do tabuleiro em HTML.

As regras locais não mudam durante a partida, então `Main` chama esta
função com `Svg.Lazy.lazy`: enquanto a lista de regras for a mesma, o
Elm nem recalcula nem compara o DOM virtual deste desenho.

-}

import Local exposing (Extra, Kind(..))
import Svg exposing (Svg)
import Svg.Attributes as A
import Variant


size : Float
size =
    100


center : Int -> ( Float, Float )
center i =
    ( (toFloat (Variant.col i) + 0.5) * size, (toFloat (Variant.row i) + 0.5) * size )


f : Float -> String
f =
    String.fromFloat


view : List Extra -> Svg msg
view extras =
    Svg.svg
        [ A.viewBox "0 0 900 900"
        , A.preserveAspectRatio "none"
        , A.class "extras-layer"
        ]
        (List.concatMap viewExtra (List.sortBy order extras))


{-| Linhas largas primeiro, marcas pequenas por cima.
-}
order : Extra -> Int
order extra =
    case extra.kind of
        ThermoLine ->
            0

        RenbanLine ->
            1

        WhiteDot ->
            5

        BlackDot ->
            5

        XSum ->
            5

        VSum ->
            5

        _ ->
            2


viewExtra : Extra -> List (Svg msg)
viewExtra extra =
    case extra.kind of
        ThermoLine ->
            case extra.cells of
                bulb :: _ ->
                    let
                        ( x, y ) =
                            center bulb
                    in
                    [ polyline "ex-thermo" extra.cells
                    , Svg.circle [ A.cx (f x), A.cy (f y), A.r "34", A.class "ex-thermo-bulb" ] []
                    ]

                [] ->
                    []

        ArrowLine ->
            case extra.cells of
                circle :: _ ->
                    let
                        ( x, y ) =
                            center circle
                    in
                    polyline "ex-arrow" extra.cells
                        :: arrowHead extra.cells
                        ++ [ Svg.circle [ A.cx (f x), A.cy (f y), A.r "40", A.class "ex-arrow-circle" ] [] ]

                [] ->
                    []

        WhisperLine ->
            [ polyline "ex-whisper" extra.cells ]

        RenbanLine ->
            [ polyline "ex-renban" extra.cells ]

        PalindromeLine ->
            [ polyline "ex-palindrome" extra.cells ]

        BetweenLine ->
            let
                end i =
                    let
                        ( x, y ) =
                            center i
                    in
                    Svg.circle [ A.cx (f x), A.cy (f y), A.r "38", A.class "ex-between-end" ] []
            in
            polyline "ex-between" extra.cells
                :: List.map end (List.take 1 extra.cells ++ List.take 1 (List.reverse extra.cells))

        WhiteDot ->
            dot "ex-dot ex-dot-white" extra.cells

        BlackDot ->
            dot "ex-dot ex-dot-black" extra.cells

        XSum ->
            letter "X" extra.cells

        VSum ->
            letter "V" extra.cells


polyline : String -> List Int -> Svg msg
polyline cls cells =
    Svg.polyline
        [ A.points
            (cells
                |> List.map (\i -> center i |> (\( x, y ) -> f x ++ "," ++ f y))
                |> String.join " "
            )
        , A.class cls
        ]
        []


arrowHead : List Int -> List (Svg msg)
arrowHead cells =
    case List.reverse cells of
        last :: before :: _ ->
            let
                ( x2, y2 ) =
                    center last

                ( x1, y1 ) =
                    center before

                len =
                    sqrt ((x2 - x1) ^ 2 + (y2 - y1) ^ 2)

                ( dx, dy ) =
                    ( (x2 - x1) / len, (y2 - y1) / len )

                wing sign =
                    Svg.line
                        [ A.x1 (f (x2 + dx * 16))
                        , A.y1 (f (y2 + dy * 16))
                        , A.x2 (f (x2 + dx * 16 - dx * 24 + sign * dy * 16))
                        , A.y2 (f (y2 + dy * 16 - dy * 24 - sign * dx * 16))
                        , A.class "ex-arrow"
                        ]
                        []
            in
            [ wing 1, wing -1 ]

        _ ->
            []


midpoint : List Int -> Maybe ( Float, Float )
midpoint cells =
    case cells of
        [ a, b ] ->
            let
                ( x1, y1 ) =
                    center a

                ( x2, y2 ) =
                    center b
            in
            Just ( (x1 + x2) / 2, (y1 + y2) / 2 )

        _ ->
            Nothing


dot : String -> List Int -> List (Svg msg)
dot cls cells =
    case midpoint cells of
        Just ( x, y ) ->
            [ Svg.circle [ A.cx (f x), A.cy (f y), A.r "11", A.class cls ] [] ]

        Nothing ->
            []


letter : String -> List Int -> List (Svg msg)
letter t cells =
    case midpoint cells of
        Just ( x, y ) ->
            [ Svg.circle [ A.cx (f x), A.cy (f y), A.r "15", A.class "ex-xv-bg" ] []
            , Svg.text_ [ A.x (f x), A.y (f (y + 9)), A.class "ex-xv" ] [ Svg.text t ]
            ]

        Nothing ->
            []
