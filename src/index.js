import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import SimilAnT from './SimilAnT';
import * as serviceWorker from './serviceWorker';
import * as PubSub from "pubsub-js";

PubSub.subscribe("ERROR", (type, message) => console.log("Error Message", message) );


ReactDOM.render(<SimilAnT />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
