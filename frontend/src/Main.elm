port module Main exposing (main)

import Api exposing (Difficulty(..), HintResult(..), HintStep, Puzzle)
import Array
import Board
import Browser
import Browser.Events
import Dict exposing (Dict)
import Game exposing (Game, Mode(..), Status(..))
import Html exposing (..)
import Html.Attributes exposing (attribute, checked, class, classList, disabled, placeholder, title, type_, value)
import Html.Events exposing (onClick, onInput)
import Json.Decode as D
import Json.Encode as E
import Overlay
import Set exposing (Set)
import Svg.Lazy
import Time
import Variant exposing (Rule(..))


port saveStats : E.Value -> Cmd msg


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- MODELO


type alias Flags =
    { stats : D.Value
    , today : Int
    , dayNumber : Int
    }


type alias Setup =
    { rules : List Rule
    , difficulty : Difficulty
    , mode : Mode
    , seedText : String
    }


type Screen
    = Welcome
    | Loading
    | Failed String
    | Playing Game


type HintState
    = NoHint
    | HintLoading
    | HintShown (List HintStep) Int
    | HintNote String


type alias Stats =
    { played : Int
    , won : Int
    , best : Dict String Int
    , streak : Int
    , lastDaily : Int
    }


type alias Model =
    { setup : Setup
    , screen : Screen
    , selected : Maybe Int
    , noteMode : Bool
    , hint : HintState
    , stats : Stats
    , today : Int
    , dayNumber : Int
    , daily : Bool
    , recorded : Bool
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { setup =
            { rules = [ Diagonal ]
            , difficulty = Medio
            , mode = Survival
            , seedText = ""
            }
      , screen = Welcome
      , selected = Nothing
      , noteMode = False
      , hint = NoHint
      , stats = D.decodeValue statsDecoder flags.stats |> Result.withDefault emptyStats
      , today = flags.today
      , dayNumber = flags.dayNumber
      , daily = False
      , recorded = False
      }
    , Cmd.none
    )


emptyStats : Stats
emptyStats =
    { played = 0, won = 0, best = Dict.empty, streak = 0, lastDaily = 0 }


statsDecoder : D.Decoder Stats
statsDecoder =
    D.map5 Stats
        (D.field "played" D.int)
        (D.field "won" D.int)
        (D.field "best" (D.dict D.int))
        (D.field "streak" D.int)
        (D.field "lastDaily" D.int)


encodeStats : Stats -> E.Value
encodeStats s =
    E.object
        [ ( "played", E.int s.played )
        , ( "won", E.int s.won )
        , ( "best", E.dict identity E.int s.best )
        , ( "streak", E.int s.streak )
        , ( "lastDaily", E.int s.lastDaily )
        ]


{-| Desafio diário: regras rotativas, mesma semente para todo mundo.
-}
dailyRules : Int -> List Rule
dailyRules dayNumber =
    let
        rotation =
            [ [ Killer ]
            , [ Diagonal, Parity ]
            , [ Hyper ]
            , [ AntiKnight ]
            , [ Killer, Diagonal ]
            , [ Hyper, Parity ]
            , [ AntiKnight, Diagonal ]
            , [ Thermo, Arrow ]
            , [ NonConsecutive ]
            , [ Kropki, XV ]
            , [ AntiKing, Whisper ]
            , [ Renban, Palindrome, Between ]
            , [ Killer, Thermo ]
            , [ Disjoint, Kropki ]
            ]
    in
    rotation
        |> List.drop (modBy (List.length rotation) dayNumber)
        |> List.head
        |> Maybe.withDefault []


recordKey : Game -> String
recordKey game =
    String.join "|"
        [ game.puzzle.rules |> List.map Variant.ruleId |> List.sort |> String.join "+"
        , game.puzzle.difficulty
        , Game.modeId game.mode
        ]



-- UPDATE


type Msg
    = ToggleRule Rule
    | SetDifficulty Difficulty
    | SetMode Mode
    | SetSeed String
    | NewGame
    | DailyGame
    | GotPuzzle (Result Api.Error Puzzle)
    | Select Int
    | Move Int Int
    | Input Int
    | Erase
    | ToggleNotes
    | AutoNotes
    | Undo
    | Redo
    | AskHint
    | GotHint (Result Api.Error HintResult)
    | HintGo Int
    | ApplyHint
    | CloseHint
    | Tick
    | Ignore


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleRule rule ->
            let
                setup =
                    model.setup

                rules =
                    if List.member rule setup.rules then
                        List.filter ((/=) rule) setup.rules

                    else
                        rule :: setup.rules
            in
            ( { model | setup = { setup | rules = rules } }, Cmd.none )

        SetDifficulty d ->
            let
                setup =
                    model.setup
            in
            ( { model | setup = { setup | difficulty = d } }, Cmd.none )

        SetMode m ->
            let
                setup =
                    model.setup
            in
            ( { model | setup = { setup | mode = m } }, Cmd.none )

        SetSeed s ->
            let
                setup =
                    model.setup
            in
            ( { model | setup = { setup | seedText = s } }, Cmd.none )

        NewGame ->
            ( { model | screen = Loading, hint = NoHint, selected = Nothing, daily = False }
            , Api.requestPuzzle model.setup.rules model.setup.difficulty (String.toInt (String.trim model.setup.seedText)) GotPuzzle
            )

        DailyGame ->
            let
                setup =
                    model.setup
            in
            ( { model
                | screen = Loading
                , hint = NoHint
                , selected = Nothing
                , daily = True
                , setup = { setup | rules = dailyRules model.dayNumber, difficulty = Dificil, mode = Survival }
              }
            , Api.requestPuzzle (dailyRules model.dayNumber) Dificil (Just model.today) GotPuzzle
            )

        GotPuzzle (Ok puzzle) ->
            let
                stats =
                    model.stats
            in
            ( { model
                | screen = Playing (Game.new model.setup.mode puzzle)
                , selected = Just 40
                , noteMode = False
                , recorded = False
                , stats = { stats | played = stats.played + 1 }
              }
            , saveStats (encodeStats { stats | played = stats.played + 1 })
            )

        GotPuzzle (Err err) ->
            ( { model | screen = Failed (Api.errorToString err) }, Cmd.none )

        Select i ->
            ( { model | selected = Just i }, Cmd.none )

        Move dr dc ->
            let
                cur =
                    Maybe.withDefault 40 model.selected

                r =
                    modBy 9 (cur // 9 + dr)

                c =
                    modBy 9 (modBy 9 cur + dc)
            in
            ( { model | selected = Just (r * 9 + c) }, Cmd.none )

        Input d ->
            withGame model (\i g -> Game.input model.noteMode i d g)

        Erase ->
            withGame model Game.clear

        ToggleNotes ->
            ( { model | noteMode = not model.noteMode }, Cmd.none )

        AutoNotes ->
            mapGame model Game.fillNotes

        Undo ->
            mapGame model Game.undo

        Redo ->
            mapGame model Game.redo

        AskHint ->
            case model.screen of
                Playing game ->
                    if game.status == Game.Playing then
                        ( { model | hint = HintLoading }
                        , Api.requestHint game.puzzle (Board.values game.board) GotHint
                        )

                    else
                        ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        GotHint (Ok HintSolved) ->
            ( { model | hint = HintNote "O tabuleiro já está resolvido!" }, Cmd.none )

        GotHint (Ok (HintErrors cells)) ->
            let
                m =
                    chargeHint model
            in
            ( { m
                | hint =
                    HintNote
                        ("Antes de avançar, corrija "
                            ++ String.fromInt (List.length cells)
                            ++ " célula(s) errada(s) marcada(s) em vermelho."
                        )
                , screen =
                    case m.screen of
                        Playing g ->
                            Playing { g | wrong = Set.union g.wrong (Set.fromList cells) }

                        other ->
                            other
              }
            , Cmd.none
            )

        GotHint (Ok (HintSteps steps)) ->
            let
                m =
                    chargeHint model
            in
            ( { m | hint = HintShown steps 0 }, Cmd.none )

        GotHint (Err err) ->
            ( { model | hint = HintNote (Api.errorToString err) }, Cmd.none )

        HintGo k ->
            case model.hint of
                HintShown steps _ ->
                    ( { model | hint = HintShown steps (clamp 0 (List.length steps - 1) k) }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ApplyHint ->
            case model.hint of
                HintShown steps _ ->
                    afterMove { model | hint = NoHint } (mapScreen (Game.applyHint steps) model.screen)

                _ ->
                    ( model, Cmd.none )

        CloseHint ->
            ( { model | hint = NoHint }, Cmd.none )

        Tick ->
            afterMove model (mapScreen Game.tick model.screen)

        Ignore ->
            ( model, Cmd.none )


chargeHint : Model -> Model
chargeHint model =
    { model
        | screen =
            mapScreen
                (\g -> { g | hintsUsed = g.hintsUsed + 1, score = max 0 (g.score - Game.hintPenalty g) })
                model.screen
    }


mapScreen : (Game -> Game) -> Screen -> Screen
mapScreen f screen =
    case screen of
        Playing g ->
            Playing (f g)

        other ->
            other


mapGame : Model -> (Game -> Game) -> ( Model, Cmd Msg )
mapGame model f =
    afterMove model (mapScreen f model.screen)


withGame : Model -> (Int -> Game -> Game) -> ( Model, Cmd Msg )
withGame model f =
    case model.selected of
        Just i ->
            afterMove { model | hint = clearStaleHint model.hint } (mapScreen (f i) model.screen)

        Nothing ->
            ( model, Cmd.none )


clearStaleHint : HintState -> HintState
clearStaleHint hint =
    case hint of
        HintLoading ->
            HintLoading

        _ ->
            NoHint


{-| Atualiza a tela e, quando a partida termina, registra estatísticas.
-}
afterMove : Model -> Screen -> ( Model, Cmd Msg )
afterMove model screen =
    case screen of
        Playing game ->
            if game.status /= Game.Playing && not model.recorded then
                let
                    stats =
                        recordResult model game model.stats
                in
                ( { model | screen = screen, stats = stats, recorded = True, hint = NoHint }
                , saveStats (encodeStats stats)
                )

            else
                ( { model | screen = screen }, Cmd.none )

        _ ->
            ( { model | screen = screen }, Cmd.none )


recordResult : Model -> Game -> Stats -> Stats
recordResult model game stats =
    case game.status of
        Won ->
            let
                key =
                    recordKey game

                best =
                    Dict.update key (\old -> Just (max game.score (Maybe.withDefault 0 old))) stats.best

                ( streak, lastDaily ) =
                    if model.daily && stats.lastDaily /= model.dayNumber then
                        if stats.lastDaily == model.dayNumber - 1 then
                            ( stats.streak + 1, model.dayNumber )

                        else
                            ( 1, model.dayNumber )

                    else
                        ( stats.streak, stats.lastDaily )
            in
            { stats | won = stats.won + 1, best = best, streak = streak, lastDaily = lastDaily }

        _ ->
            stats



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.screen of
        Playing game ->
            Sub.batch
                [ if game.status == Game.Playing then
                    Time.every 1000 (\_ -> Tick)

                  else
                    Sub.none
                , Browser.Events.onKeyDown keyDecoder
                ]

        _ ->
            Sub.none


keyDecoder : D.Decoder Msg
keyDecoder =
    D.oneOf [ D.at [ "target", "tagName" ] D.string, D.succeed "" ]
        |> D.andThen
            (\tag ->
                if tag == "INPUT" then
                    D.fail "digitando em um campo"

                else
                    D.field "key" D.string
            )
        |> D.andThen
            (\key ->
                case String.toInt key of
                    Just d ->
                        if d >= 1 && d <= 9 then
                            D.succeed (Input d)

                        else
                            D.succeed Erase

                    Nothing ->
                        case key of
                            "Backspace" ->
                                D.succeed Erase

                            "Delete" ->
                                D.succeed Erase

                            "ArrowUp" ->
                                D.succeed (Move -1 0)

                            "ArrowDown" ->
                                D.succeed (Move 1 0)

                            "ArrowLeft" ->
                                D.succeed (Move 0 -1)

                            "ArrowRight" ->
                                D.succeed (Move 0 1)

                            "n" ->
                                D.succeed ToggleNotes

                            "N" ->
                                D.succeed ToggleNotes

                            "z" ->
                                D.succeed Undo

                            "y" ->
                                D.succeed Redo

                            "h" ->
                                D.succeed AskHint

                            "a" ->
                                D.succeed AutoNotes

                            _ ->
                                D.fail "tecla ignorada"
            )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ header [ class "topbar" ]
            [ h1 [] [ text "Super ", span [ class "accent" ] [ text "Sudoku" ] ]
            , viewStats model.stats
            ]
        , main_ [ class "layout" ]
            [ viewSetup model
            , section [ class "stage" ] [ viewStage model ]
            , viewSide model
            ]
        , footer [ class "footer" ]
            [ text "Lógica em Elm + Prolog (CLP(FD)). Atalhos: 1–9, setas, Backspace, N (notas), A (auto-notas), Z/Y (desfazer/refazer), H (dica)." ]
        ]


viewStats : Stats -> Html Msg
viewStats stats =
    div [ class "stats" ]
        [ statPill "Jogos" (String.fromInt stats.played)
        , statPill "Vitórias" (String.fromInt stats.won)
        , statPill "Sequência diária" (String.fromInt stats.streak)
        ]


statPill : String -> String -> Html Msg
statPill label value =
    div [ class "pill" ] [ span [ class "pill-label" ] [ text label ], strong [] [ text value ] ]


viewRuleList : Setup -> List Rule -> Html Msg
viewRuleList setup rules =
    div [ class "rules" ]
        (List.map
            (\rule ->
                label
                    [ classList [ ( "rule", True ), ( "on", List.member rule setup.rules ) ]
                    , title (Variant.ruleDescription rule)
                    ]
                    [ input [ type_ "checkbox", checked (List.member rule setup.rules), onClick (ToggleRule rule) ] []
                    , span [ class "rule-name" ] [ text (Variant.ruleName rule) ]
                    , small [] [ text (Variant.ruleDescription rule) ]
                    ]
            )
            rules
        )


viewSetup : Model -> Html Msg
viewSetup model =
    let
        setup =
            model.setup
    in
    aside [ class "panel setup" ]
        [ h2 [] [ text "Nova partida" ]
        , h3 [] [ text "Regras globais" ]
        , viewRuleList setup (List.filter (not << Variant.isLocal) Variant.allRules)
        , h3 [] [ text "Regras locais (desenhadas)" ]
        , viewRuleList setup (List.filter Variant.isLocal Variant.allRules)
        , h3 [] [ text "Dificuldade" ]
        , div [ class "segmented" ]
            (List.map
                (\d ->
                    button
                        [ classList [ ( "seg", True ), ( "on", d == setup.difficulty ) ]
                        , onClick (SetDifficulty d)
                        ]
                        [ text (Api.difficultyName d) ]
                )
                Api.allDifficulties
            )
        , h3 [] [ text "Modo" ]
        , div [ class "modes" ]
            (List.map
                (\m ->
                    button
                        [ classList [ ( "mode", True ), ( "on", m == setup.mode ) ]
                        , onClick (SetMode m)
                        ]
                        [ strong [] [ text (Game.modeName m) ]
                        , small [] [ text (Game.modeDescription m) ]
                        ]
                )
                Game.allModes
            )
        , h3 [] [ text "Semente (opcional)" ]
        , input
            [ class "seed"
            , placeholder "aleatória"
            , value setup.seedText
            , onInput SetSeed
            , attribute "inputmode" "numeric"
            ]
            []
        , button [ class "primary", onClick NewGame, disabled (model.screen == Loading) ] [ text "Gerar puzzle" ]
        , button [ class "secondary", onClick DailyGame, disabled (model.screen == Loading) ]
            [ text "Desafio diário"
            , small []
                [ text
                    (case dailyRules model.dayNumber of
                        [] ->
                            "clássico"

                        rs ->
                            String.join " + " (List.map Variant.ruleName rs)
                    )
                ]
            ]
        ]


viewStage : Model -> Html Msg
viewStage model =
    case model.screen of
        Welcome ->
            div [ class "message" ]
                [ h2 [] [ text "Bem-vindo ao Super Sudoku" ]
                , p [] [ text "Combine regras extras, escolha a dificuldade e um modo de jogo. O servidor em Prolog gera um puzzle com solução única e classifica a dificuldade pelas técnicas lógicas necessárias." ]
                , p [] [ text "Empacou? Peça uma dica: o motor lógico explica o próximo passo, como um professor faria." ]
                ]

        Loading ->
            div [ class "message" ]
                [ div [ class "spinner" ] []
                , p [] [ text "O Prolog está gerando e avaliando o puzzle…" ]
                ]

        Failed err ->
            div [ class "message error" ]
                [ h2 [] [ text "Não foi possível gerar o puzzle" ]
                , p [] [ text err ]
                ]

        Playing game ->
            viewBoard model game


viewBoard : Model -> Game -> Html Msg
viewBoard model game =
    let
        conflicts =
            Board.conflicts game.geo game.puzzle.parity game.board

        selectedValue =
            model.selected |> Maybe.map (\i -> (Board.cell i game.board).value) |> Maybe.withDefault 0

        selectedPeers =
            model.selected
                |> Maybe.andThen (\i -> Array.get i game.geo.peers)
                |> Maybe.withDefault Set.empty

        hintStep =
            case model.hint of
                HintShown steps k ->
                    List.head (List.drop k steps)

                _ ->
                    Nothing

        ctx =
            { game = game
            , conflicts = conflicts
            , selected = model.selected
            , selectedValue = selectedValue
            , selectedPeers = selectedPeers
            , hint = hintStep
            }
    in
    div [ class "board-wrap" ]
        [ div
            [ classList
                [ ( "board", True )
                , ( "has-diag", List.member Diagonal game.puzzle.rules )
                , ( "has-hyper", List.member Hyper game.puzzle.rules )
                ]
            ]
            (List.map (viewCell ctx) (List.range 0 80))
        , Svg.Lazy.lazy Overlay.view game.puzzle.extras
        , viewOverlay game
        ]


type alias CellCtx =
    { game : Game
    , conflicts : Set Int
    , selected : Maybe Int
    , selectedValue : Int
    , selectedPeers : Set Int
    , hint : Maybe HintStep
    }


viewCell : CellCtx -> Int -> Html Msg
viewCell ctx i =
    let
        game =
            ctx.game

        c =
            Board.cell i game.board

        rules =
            game.puzzle.rules

        r =
            Variant.row i

        co =
            Variant.col i

        hintFocus =
            ctx.hint |> Maybe.map (\h -> List.member i h.focus) |> Maybe.withDefault False

        hintUnit =
            ctx.hint |> Maybe.map (\h -> List.member i h.unit) |> Maybe.withDefault False

        hintElims =
            ctx.hint
                |> Maybe.map (\h -> h.eliminations |> List.filter (\( j, _ ) -> j == i) |> List.map Tuple.second)
                |> Maybe.withDefault []

        hintPlace =
            ctx.hint
                |> Maybe.andThen .placement
                |> Maybe.andThen
                    (\( j, d ) ->
                        if j == i then
                            Just d

                        else
                            Nothing
                    )
    in
    div
        [ classList
            [ ( "cell", True )
            , ( "br", co == 2 || co == 5 )
            , ( "bb", r == 2 || r == 5 )
            , ( "given", c.given )
            , ( "user", not c.given && c.value /= 0 )
            , ( "selected", ctx.selected == Just i )
            , ( "peer", Set.member i ctx.selectedPeers )
            , ( "same", ctx.selectedValue /= 0 && c.value == ctx.selectedValue )
            , ( "conflict", Set.member i ctx.conflicts )
            , ( "wrong", Set.member i game.wrong )
            , ( "diag", List.member Diagonal rules && Variant.isDiagonal i )
            , ( "window", List.member Hyper rules && Variant.isWindow i )
            , ( "hint-unit", hintUnit )
            , ( "hint-focus", hintFocus )
            , ( "hint-elim", not (List.isEmpty hintElims) )
            , ( "hint-place", hintPlace /= Nothing )
            ]
        , onClick (Select i)
        ]
        (viewCage game i
            ++ viewParity game i
            ++ [ viewContent c hintElims hintPlace ]
        )


viewCage : Game -> Int -> List (Html Msg)
viewCage game i =
    case Dict.get i game.geo.cageOf of
        Nothing ->
            []

        Just k ->
            let
                same j =
                    Dict.get j game.geo.cageOf == Just k

                r =
                    Variant.row i

                co =
                    Variant.col i

                sides =
                    [ ( "t", r == 0 || not (same (i - 9)) )
                    , ( "b", r == 8 || not (same (i + 9)) )
                    , ( "l", co == 0 || not (same (i - 1)) )
                    , ( "r", co == 8 || not (same (i + 1)) )
                    ]

                cage =
                    Array.get k game.geo.cages

                isAnchor =
                    cage |> Maybe.map (\cg -> List.minimum cg.cells == Just i) |> Maybe.withDefault False
            in
            span [ classList (( "cage", True ) :: sides) ] []
                :: (if isAnchor then
                        [ span [ class "cage-sum" ] [ text (cage |> Maybe.map (.sum >> String.fromInt) |> Maybe.withDefault "") ] ]

                    else
                        []
                   )


viewParity : Game -> Int -> List (Html Msg)
viewParity game i =
    case Array.get i game.puzzle.parity of
        Just 1 ->
            [ span [ class "parity odd", title "ímpar" ] [] ]

        Just 2 ->
            [ span [ class "parity even", title "par" ] [] ]

        _ ->
            []


viewContent : Board.Cell -> List Int -> Maybe Int -> Html Msg
viewContent c elims hintPlace =
    if c.value /= 0 then
        span [ class "value" ] [ text (String.fromInt c.value) ]

    else
        case hintPlace of
            Just d ->
                span [ class "value ghost" ] [ text (String.fromInt d) ]

            Nothing ->
                div [ class "notes" ]
                    (List.map
                        (\d ->
                            span
                                [ classList [ ( "elim", List.member d elims ) ] ]
                                [ text
                                    (if Set.member d c.notes || List.member d elims then
                                        String.fromInt d

                                     else
                                        ""
                                    )
                                ]
                        )
                        (List.range 1 9)
                    )


viewOverlay : Game -> Html Msg
viewOverlay game =
    case game.status of
        Game.Playing ->
            text ""

        Won ->
            div [ class "overlay" ]
                [ div [ class "overlay-card" ]
                    [ h2 [] [ text "Resolvido!" ]
                    , p [ class "big" ] [ text (String.fromInt game.score), small [] [ text " pontos" ] ]
                    , ul [ class "breakdown" ]
                        [ li [] [ text ("Tempo: " ++ formatTime game.elapsed) ]
                        , li [] [ text ("Bônus de conclusão: " ++ String.fromInt game.finalBonus) ]
                        , li [] [ text ("Maior combo: ×" ++ String.fromInt game.bestCombo) ]
                        , li [] [ text ("Erros: " ++ String.fromInt game.mistakes ++ " · Dicas: " ++ String.fromInt game.hintsUsed) ]
                        ]
                    , viewTechniques game
                    , button [ class "primary", onClick NewGame ] [ text "Jogar de novo" ]
                    ]
                ]

        Lost reason ->
            div [ class "overlay" ]
                [ div [ class "overlay-card lost" ]
                    [ h2 [] [ text "Fim de jogo" ]
                    , p [] [ text reason ]
                    , viewTechniques game
                    , button [ class "primary", onClick NewGame ] [ text "Tentar outro" ]
                    ]
                ]


viewTechniques : Game -> Html Msg
viewTechniques game =
    div [ class "techniques" ]
        [ h3 [] [ text ("Análise lógica: " ++ game.puzzle.rating.label) ]
        , ul []
            (List.map
                (\t ->
                    li []
                        [ span [ class ("lvl lvl" ++ String.fromInt t.level) ] [ text (String.fromInt t.level) ]
                        , text (t.name ++ " ×" ++ String.fromInt t.count)
                        ]
                )
                game.puzzle.rating.techniques
            )
        ]


viewSide : Model -> Html Msg
viewSide model =
    case model.screen of
        Playing game ->
            aside [ class "panel side" ]
                [ viewHud model game
                , viewPad model game
                , viewTools model game
                , viewHint model
                , viewInfo game
                ]

        _ ->
            aside [ class "panel side muted" ]
                [ h2 [] [ text "Como funciona" ]
                , ul [ class "howto" ]
                    [ li [] [ text "Cada regra extra é um conjunto de restrições CLP(FD) no Prolog." ]
                    , li [] [ text "A dificuldade é medida pela técnica humana mais difícil necessária, não pelo número de pistas." ]
                    , li [] [ text "Combos: acertos seguidos em até 15 s multiplicam os pontos (até ×8)." ]
                    , li [] [ text "O desafio diário é igual para todos e conta a sua sequência de dias." ]
                    ]
                ]


viewHud : Model -> Game -> Html Msg
viewHud model game =
    let
        best =
            Dict.get (recordKey game) model.stats.best
    in
    div [ class "hud" ]
        [ div [ class "hud-item" ]
            [ span [ class "pill-label" ]
                [ text
                    (if game.mode == TimeAttack then
                        "Restante"

                     else
                        "Tempo"
                    )
                ]
            , strong
                [ classList [ ( "danger", game.mode == TimeAttack && game.timeLeft < 30 ) ] ]
                [ text
                    (formatTime
                        (if game.mode == TimeAttack then
                            game.timeLeft

                         else
                            game.elapsed
                        )
                    )
                ]
            ]
        , div [ class "hud-item" ] [ span [ class "pill-label" ] [ text "Pontos" ], strong [] [ text (String.fromInt game.score) ] ]
        , div [ class "hud-item" ]
            [ span [ class "pill-label" ] [ text "Combo" ]
            , strong [ classList [ ( "hot", game.combo >= 3 ) ] ] [ text ("×" ++ String.fromInt (max 1 game.combo)) ]
            ]
        , if game.mode == Survival then
            div [ class "hud-item" ]
                [ span [ class "pill-label" ] [ text "Vidas" ]
                , strong [ class "lives" ] [ text (String.repeat game.lives "♥" ++ String.repeat (3 - game.lives) "♡") ]
                ]

          else
            text ""
        , case best of
            Just b ->
                div [ class "hud-item" ] [ span [ class "pill-label" ] [ text "Recorde" ], strong [] [ text (String.fromInt b) ] ]

            Nothing ->
                text ""
        ]


viewPad : Model -> Game -> Html Msg
viewPad model game =
    div [ classList [ ( "pad", True ), ( "notes-on", model.noteMode ) ] ]
        (List.map
            (\d ->
                let
                    left =
                        9 - Board.digitCount game.board d
                in
                button [ classList [ ( "key", True ), ( "done", left <= 0 ) ], onClick (Input d) ]
                    [ text (String.fromInt d)
                    , small [] [ text (String.fromInt (max 0 left)) ]
                    ]
            )
            (List.range 1 9)
        )


viewTools : Model -> Game -> Html Msg
viewTools model game =
    div [ class "tools" ]
        [ button [ classList [ ( "tool", True ), ( "on", model.noteMode ) ], onClick ToggleNotes ] [ text "✎ Notas" ]
        , button [ class "tool", onClick AutoNotes ] [ text "⚡ Auto-notas" ]
        , button [ class "tool", onClick Erase ] [ text "⌫ Apagar" ]
        , button [ class "tool", onClick Undo, disabled (List.isEmpty game.past) ] [ text "↶ Desfazer" ]
        , button [ class "tool", onClick Redo, disabled (List.isEmpty game.future) ] [ text "↷ Refazer" ]
        , button [ class "tool hint-btn", onClick AskHint, disabled (game.status /= Game.Playing) ]
            [ text ("💡 Dica (−" ++ String.fromInt (Game.hintPenalty game) ++ ")") ]
        ]


viewHint : Model -> Html Msg
viewHint model =
    case model.hint of
        NoHint ->
            text ""

        HintLoading ->
            div [ class "hint-card" ] [ div [ class "spinner small" ] [], text " Raciocinando…" ]

        HintNote note ->
            div [ class "hint-card" ]
                [ p [] [ text note ]
                , button [ class "link", onClick CloseHint ] [ text "Fechar" ]
                ]

        HintShown steps k ->
            let
                total =
                    List.length steps
            in
            case List.head (List.drop k steps) of
                Nothing ->
                    text ""

                Just step ->
                    div [ class "hint-card" ]
                        [ div [ class "hint-head" ]
                            [ span [ class ("lvl lvl" ++ String.fromInt step.level) ] [ text (String.fromInt step.level) ]
                            , strong [] [ text step.name ]
                            , span [ class "hint-count" ] [ text (String.fromInt (k + 1) ++ "/" ++ String.fromInt total) ]
                            ]
                        , p [] [ text step.message ]
                        , div [ class "hint-actions" ]
                            [ button [ class "link", onClick (HintGo (k - 1)), disabled (k == 0) ] [ text "← Anterior" ]
                            , button [ class "link", onClick (HintGo (k + 1)), disabled (k >= total - 1) ] [ text "Próximo →" ]
                            , button [ class "primary small", onClick ApplyHint ] [ text "Aplicar" ]
                            , button [ class "link", onClick CloseHint ] [ text "Fechar" ]
                            ]
                        ]


viewInfo : Game -> Html Msg
viewInfo game =
    div [ class "info" ]
        [ p []
            [ strong [] [ text "Regras: " ]
            , text
                (if List.isEmpty game.puzzle.rules then
                    "clássico"

                 else
                    String.join ", " (List.map Variant.ruleName game.puzzle.rules)
                )
            ]
        , p [] [ strong [] [ text "Nível lógico: " ], text (game.puzzle.rating.label ++ " (" ++ String.fromInt game.puzzle.rating.level ++ "/5)") ]
        , p [] [ strong [] [ text "Modo: " ], text (Game.modeName game.mode) ]
        , p [] [ strong [] [ text "Modelo CLP(FD): " ], text (String.fromInt game.puzzle.constraints ++ " restrições") ]
        , p [] [ strong [] [ text "Semente: " ], code [] [ text (String.fromInt game.puzzle.seed) ] ]
        ]


formatTime : Int -> String
formatTime secs =
    let
        m =
            secs // 60

        s =
            modBy 60 secs
    in
    String.fromInt m ++ ":" ++ String.padLeft 2 '0' (String.fromInt s)
