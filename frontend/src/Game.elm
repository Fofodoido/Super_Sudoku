module Game exposing
    ( Game
    , Mode(..)
    , Status(..)
    , allModes
    , applyHint
    , clear
    , fillNotes
    , hintPenalty
    , input
    , modeDescription
    , modeId
    , modeName
    , new
    , redo
    , tick
    , undo
    )

{-| Regras de uma partida: modos de jogo, vidas, cronômetro, pontuação
com combos, histórico de desfazer/refazer e condição de vitória.
-}

import Api exposing (HintStep, Puzzle)
import Array
import Board exposing (Board)
import Set exposing (Set)
import Variant exposing (Geometry)


type Mode
    = Relax
    | Survival
    | TimeAttack


allModes : List Mode
allModes =
    [ Relax, Survival, TimeAttack ]


modeId : Mode -> String
modeId mode =
    case mode of
        Relax ->
            "relax"

        Survival ->
            "survival"

        TimeAttack ->
            "timeattack"


modeName : Mode -> String
modeName mode =
    case mode of
        Relax ->
            "Relaxado"

        Survival ->
            "Sobrevivência"

        TimeAttack ->
            "Contra o relógio"


modeDescription : Mode -> String
modeDescription mode =
    case mode of
        Relax ->
            "Sem limites. Erros só aparecem quando quebram uma regra visível."

        Survival ->
            "3 vidas. Cada dígito errado custa uma vida e zera o combo."

        TimeAttack ->
            "Relógio regressivo. Acertos dão tempo extra, erros tiram 20 s."


type Status
    = Playing
    | Won
    | Lost String


type alias Game =
    { puzzle : Puzzle
    , geo : Geometry
    , board : Board
    , past : List Board
    , future : List Board
    , mode : Mode
    , status : Status
    , lives : Int
    , mistakes : Int
    , wrong : Set Int
    , elapsed : Int
    , timeLeft : Int
    , score : Int
    , combo : Int
    , bestCombo : Int
    , lastCorrectAt : Int
    , hintsUsed : Int
    , finalBonus : Int
    }


new : Mode -> Puzzle -> Game
new mode puzzle =
    { puzzle = puzzle
    , geo = Variant.geometry puzzle.rules puzzle.cages puzzle.extras
    , board = Board.fromPuzzle puzzle.givens
    , past = []
    , future = []
    , mode = mode
    , status = Playing
    , lives = 3
    , mistakes = 0
    , wrong = Set.empty
    , elapsed = 0
    , timeLeft = startingTime puzzle
    , score = 0
    , combo = 0
    , bestCombo = 0
    , lastCorrectAt = -100
    , hintsUsed = 0
    , finalBonus = 0
    }


startingTime : Puzzle -> Int
startingTime puzzle =
    let
        empties =
            List.length (List.filter ((==) 0) puzzle.givens)
    in
    60 + empties * (4 + 3 * puzzle.rating.level)


{-| Pontos-base por acerto: cresce com o nível lógico do puzzle e com o
número de regras extras ativas.
-}
basePoints : Game -> Int
basePoints game =
    10 * game.puzzle.rating.level + 5 * List.length game.puzzle.rules


comboWindow : Int
comboWindow =
    15


tick : Game -> Game
tick game =
    case game.status of
        Playing ->
            let
                g =
                    { game | elapsed = game.elapsed + 1 }
            in
            case game.mode of
                TimeAttack ->
                    if g.timeLeft <= 1 then
                        { g | timeLeft = 0, status = Lost "O tempo acabou!" }

                    else
                        { g | timeLeft = g.timeLeft - 1 }

                _ ->
                    g

        _ ->
            game


pushHistory : Game -> Game
pushHistory game =
    { game | past = List.take 200 (game.board :: game.past), future = [] }


solutionAt : Game -> Int -> Int
solutionAt game i =
    Array.get i game.puzzle.solution |> Maybe.withDefault 0


{-| Entrada de um dígito na célula selecionada (valor ou anotação).
-}
input : Bool -> Int -> Int -> Game -> Game
input noteMode i digit game =
    let
        c =
            Board.cell i game.board
    in
    if game.status /= Playing || c.given then
        game

    else if noteMode then
        if c.value /= 0 then
            game

        else
            let
                g =
                    pushHistory game
            in
            { g | board = Board.toggleNote i digit game.board }

    else if c.value == digit then
        clear i game

    else
        place i digit (pushHistory game)


place : Int -> Int -> Game -> Game
place i digit game =
    let
        board =
            Board.setValue game.geo i digit game.board

        correct =
            solutionAt game i == digit
    in
    case game.mode of
        Relax ->
            checkWin { game | board = board, wrong = Set.remove i game.wrong }

        _ ->
            if correct then
                let
                    combo =
                        if game.elapsed - game.lastCorrectAt <= comboWindow then
                            game.combo + 1

                        else
                            1

                    points =
                        basePoints game * min combo 8

                    bonusTime =
                        if game.mode == TimeAttack then
                            5 + 2 * game.puzzle.rating.level

                        else
                            0
                in
                checkWin
                    { game
                        | board = board
                        , wrong = Set.remove i game.wrong
                        , combo = combo
                        , bestCombo = max combo game.bestCombo
                        , lastCorrectAt = game.elapsed
                        , score = game.score + points
                        , timeLeft = game.timeLeft + bonusTime
                    }

            else
                mistake i { game | board = board }


mistake : Int -> Game -> Game
mistake i game =
    let
        g =
            { game
                | wrong = Set.insert i game.wrong
                , mistakes = game.mistakes + 1
                , combo = 0
                , score = max 0 (game.score - basePoints game)
            }
    in
    case game.mode of
        Survival ->
            if g.lives <= 1 then
                { g | lives = 0, status = Lost "Suas vidas acabaram!" }

            else
                { g | lives = g.lives - 1 }

        TimeAttack ->
            if g.timeLeft <= 20 then
                { g | timeLeft = 0, status = Lost "O tempo acabou!" }

            else
                { g | timeLeft = g.timeLeft - 20 }

        Relax ->
            g


checkWin : Game -> Game
checkWin game =
    if Board.isFull game.board && Board.matchesSolution game.puzzle.solution game.board then
        let
            bonus =
                finalBonus game
        in
        { game | status = Won, finalBonus = bonus, score = game.score + bonus }

    else
        game


{-| Bônus de conclusão: dificuldade real × regras extras, descontando
tempo, erros e dicas. No modo relaxado é a única fonte de pontos.
-}
finalBonus : Game -> Int
finalBonus game =
    let
        level =
            game.puzzle.rating.level

        variety =
            1 + List.length game.puzzle.rules

        base =
            300 * level * variety

        timePenalty =
            game.elapsed // 2

        livesBonus =
            if game.mode == Survival then
                game.lives * 150

            else
                0

        clockBonus =
            if game.mode == TimeAttack then
                game.timeLeft * 3

            else
                0
    in
    max 0 (base - timePenalty - 50 * game.mistakes - hintPenalty game * game.hintsUsed + livesBonus + clockBonus)


hintPenalty : Game -> Int
hintPenalty game =
    40 + 20 * game.puzzle.rating.level


clear : Int -> Game -> Game
clear i game =
    let
        c =
            Board.cell i game.board
    in
    if game.status /= Playing || c.given || (c.value == 0 && Set.isEmpty c.notes) then
        game

    else
        let
            g =
                pushHistory game
        in
        { g | board = Board.clearCell i game.board, wrong = Set.remove i game.wrong }


fillNotes : Game -> Game
fillNotes game =
    if game.status /= Playing then
        game

    else
        let
            g =
                pushHistory game
        in
        { g | board = Board.autoNotes game.geo game.puzzle.parity game.board }


undo : Game -> Game
undo game =
    case game.past of
        prev :: rest ->
            if game.status == Playing then
                { game | board = prev, past = rest, future = game.board :: game.future }

            else
                game

        [] ->
            game


redo : Game -> Game
redo game =
    case game.future of
        next :: rest ->
            if game.status == Playing then
                { game | board = next, future = rest, past = game.board :: game.past }

            else
                game

        [] ->
            game


{-| Aplica a cadeia de uma dica: eliminações nas anotações e, se houver,
a colocação final (que conta como acerto, mas sem combo).
-}
applyHint : List HintStep -> Game -> Game
applyHint steps game =
    if game.status /= Playing then
        game

    else
        let
            g =
                pushHistory game

            elims =
                List.concatMap .eliminations steps

            board1 =
                Board.applyEliminations elims g.board

            placement =
                steps |> List.filterMap .placement |> List.head
        in
        case placement of
            Just ( i, d ) ->
                checkWin
                    { g
                        | board = Board.setValue g.geo i d board1
                        , wrong = Set.remove i g.wrong
                        , combo = 0
                    }

            Nothing ->
                { g | board = board1 }
