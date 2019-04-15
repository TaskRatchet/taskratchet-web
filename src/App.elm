module App exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)

type alias Task =
    { id : Int
    , description : String
    , due : Int
    , stakes : Int
    , status : String
    }

-- MAIN

main =
    Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model =
    { tasks : List Task
    }


init : Model
init =
    { tasks = [ Task 0 "Task 0" 12345678 5 "active"
                  , Task 1 "Task 1" 12345678 5 "active"
                  ]
    }


-- UPDATE

type Msg
    = Change String


update : Msg -> Model -> Model
update msg model =
    model


-- VIEW

view : Model -> Html Msg
view  model =
    ul []
        ( List.map ( \t -> li [] [ text t.description ] ) model.tasks )

