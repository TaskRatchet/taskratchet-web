import React from "react";
import ReactDOM from "react-dom";
import App from './App'

var style = {
    backgroundColor: 'orange',
    color: 'white',
    fontFamily: 'Arial'
};

ReactDOM.render(
    <App lakes={[]} />,
    document.getElementById('root')
);