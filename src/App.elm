module App exposing (..)

import Browser
import Html exposing (Html, Attribute, div, input, text)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)


-- MAIN

main =
    Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model =
    {
    }


init : Model
init =
    {}


-- UPDATE

type Msg
    = Change String


update : Msg -> Model -> Model
update msg model =
    model


-- VIEW

view : Model -> Html Msg
view  model =
    div []
        [ text "Hello World"
        ]

