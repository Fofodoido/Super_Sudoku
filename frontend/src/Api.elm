module Api exposing
    ( Difficulty(..)
    , HintResult(..)
    , HintStep
    , Puzzle
    , Rating
    , TechniqueUse
    , allDifficulties
    , difficultyId
    , difficultyName
    , Error
    , errorToString
    , requestHint
    , requestPuzzle
    )

{-| Comunicação com o servidor Prolog (`backend/server.pl`).
-}

import Array exposing (Array)
import Http
import Json.Decode as D
import Json.Encode as E
import Local exposing (Extra)
import Variant exposing (Cage, Rule)


type Difficulty
    = Facil
    | Medio
    | Dificil
    | Extremo


allDifficulties : List Difficulty
allDifficulties =
    [ Facil, Medio, Dificil, Extremo ]


difficultyId : Difficulty -> String
difficultyId d =
    case d of
        Facil ->
            "facil"

        Medio ->
            "medio"

        Dificil ->
            "dificil"

        Extremo ->
            "extremo"


difficultyName : Difficulty -> String
difficultyName d =
    case d of
        Facil ->
            "Fácil"

        Medio ->
            "Médio"

        Dificil ->
            "Difícil"

        Extremo ->
            "Extremo"


type alias TechniqueUse =
    { id : String
    , name : String
    , level : Int
    , count : Int
    }


type alias Rating =
    { level : Int
    , label : String
    , techniques : List TechniqueUse
    }


type alias Puzzle =
    { rules : List Rule
    , difficulty : String
    , seed : Int
    , givens : List Int
    , solution : Array Int
    , cages : List Cage
    , parity : Array Int
    , extras : List Extra
    , constraints : Int
    , rating : Rating
    }


type alias HintStep =
    { technique : String
    , name : String
    , level : Int
    , message : String
    , focus : List Int
    , unit : List Int
    , eliminations : List ( Int, Int )
    , placement : Maybe ( Int, Int )
    }


type HintResult
    = HintSolved
    | HintErrors (List Int)
    | HintSteps (List HintStep)



-- REQUISIÇÕES


{-| Erro de rede ou a mensagem de erro (em português) enviada pelo servidor.
-}
type Error
    = HttpError Http.Error
    | ServerError String


expectJson : (Result Error a -> msg) -> D.Decoder a -> Http.Expect msg
expectJson toMsg decoder =
    Http.expectStringResponse toMsg <|
        \response ->
            case response of
                Http.GoodStatus_ _ body ->
                    D.decodeString decoder body
                        |> Result.mapError (HttpError << Http.BadBody << D.errorToString)

                Http.BadStatus_ meta body ->
                    case D.decodeString (D.field "error" D.string) body of
                        Ok msg ->
                            Err (ServerError msg)

                        Err _ ->
                            Err (HttpError (Http.BadStatus meta.statusCode))

                Http.BadUrl_ u ->
                    Err (HttpError (Http.BadUrl u))

                Http.Timeout_ ->
                    Err (HttpError Http.Timeout)

                Http.NetworkError_ ->
                    Err (HttpError Http.NetworkError)


requestPuzzle : List Rule -> Difficulty -> Maybe Int -> (Result Error Puzzle -> msg) -> Cmd msg
requestPuzzle rules difficulty seed toMsg =
    Http.post
        { url = "/api/new"
        , body =
            Http.jsonBody <|
                E.object
                    [ ( "rules", E.list (E.string << Variant.ruleId) rules )
                    , ( "difficulty", E.string (difficultyId difficulty) )
                    , ( "seed", Maybe.map E.int seed |> Maybe.withDefault E.null )
                    ]
        , expect = expectJson toMsg puzzleDecoder
        }


requestHint : Puzzle -> List Int -> (Result Error HintResult -> msg) -> Cmd msg
requestHint puzzle board toMsg =
    Http.post
        { url = "/api/hint"
        , body =
            Http.jsonBody <|
                E.object
                    [ ( "rules", E.list (E.string << Variant.ruleId) puzzle.rules )
                    , ( "cages", E.list encodeCage puzzle.cages )
                    , ( "parity", E.array E.int puzzle.parity )
                    , ( "extras", E.list Local.encode puzzle.extras )
                    , ( "board", E.list E.int board )
                    , ( "solution", E.array E.int puzzle.solution )
                    ]
        , expect = expectJson toMsg hintDecoder
        }


encodeCage : Cage -> E.Value
encodeCage cage =
    E.object
        [ ( "sum", E.int cage.sum )
        , ( "cells", E.list E.int cage.cells )
        ]


errorToString : Error -> String
errorToString error =
    case error of
        ServerError msg ->
            msg

        HttpError err ->
            httpErrorToString err


httpErrorToString : Http.Error -> String
httpErrorToString err =
    case err of
        Http.BadUrl u ->
            "URL inválida: " ++ u

        Http.Timeout ->
            "O servidor demorou demais para responder."

        Http.NetworkError ->
            "Sem conexão com o servidor Prolog. Ele está rodando?"

        Http.BadStatus code ->
            "O servidor respondeu com erro " ++ String.fromInt code ++ "."

        Http.BadBody msg ->
            "Resposta inesperada do servidor: " ++ msg



-- DECODERS


{-| `D.map8` vai só até 8 campos e o puzzle tem 10. `andMap` aplica um
decoder de função a mais um campo: é o mesmo padrão de "applicative"
que `Json.Decode.Pipeline` usa por baixo.
-}
andMap : D.Decoder a -> D.Decoder (a -> b) -> D.Decoder b
andMap =
    D.map2 (|>)


puzzleDecoder : D.Decoder Puzzle
puzzleDecoder =
    D.succeed Puzzle
        |> andMap (D.field "rules" (D.list D.string) |> D.map (List.filterMap Variant.ruleFromId))
        |> andMap (D.field "difficulty" D.string)
        |> andMap (D.field "seed" D.int)
        |> andMap (D.field "puzzle" (D.list D.int))
        |> andMap (D.field "solution" (D.array D.int))
        |> andMap (D.field "cages" (D.list cageDecoder))
        |> andMap (D.field "parity" (D.array D.int))
        |> andMap (D.oneOf [ D.field "extras" (D.list Local.decoder), D.succeed [] ])
        |> andMap (D.oneOf [ D.field "constraints" D.int, D.succeed 0 ])
        |> andMap (D.field "rating" ratingDecoder)


cageDecoder : D.Decoder Cage
cageDecoder =
    D.map2 Cage
        (D.field "sum" D.int)
        (D.field "cells" (D.list D.int))


ratingDecoder : D.Decoder Rating
ratingDecoder =
    D.map3 Rating
        (D.field "level" D.int)
        (D.field "label" D.string)
        (D.field "techniques"
            (D.list
                (D.map4 TechniqueUse
                    (D.field "id" D.string)
                    (D.field "name" D.string)
                    (D.field "level" D.int)
                    (D.field "count" D.int)
                )
            )
        )


hintDecoder : D.Decoder HintResult
hintDecoder =
    D.field "status" D.string
        |> D.andThen
            (\status ->
                case status of
                    "solved" ->
                        D.succeed HintSolved

                    "errors" ->
                        D.map HintErrors (D.field "cells" (D.list D.int))

                    "steps" ->
                        D.map HintSteps (D.field "steps" (D.list stepDecoder))

                    other ->
                        D.fail ("status desconhecido: " ++ other)
            )


cellDigit : D.Decoder ( Int, Int )
cellDigit =
    D.map2 Tuple.pair
        (D.field "cell" D.int)
        (D.field "digit" D.int)


stepDecoder : D.Decoder HintStep
stepDecoder =
    D.map8 HintStep
        (D.field "technique" D.string)
        (D.field "name" D.string)
        (D.field "level" D.int)
        (D.field "message" D.string)
        (D.field "focus" (D.list D.int))
        (D.field "unit" (D.list D.int))
        (D.field "eliminations" (D.list cellDigit))
        (D.field "placement" (D.nullable cellDigit))
