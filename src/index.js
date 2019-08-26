import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const lakeList = [
    {id: 1, name: "Echo Lake", trailhead: "Echo Lake"},
    {id: 2, name: "Maud Lake", trailhead: "Wright's Lake"},
    {id: 3, name: "Cascade Lake", trailhead: "Bayview"},
];

ReactDOM.render(
<App lakes={lakeList} />,
document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
