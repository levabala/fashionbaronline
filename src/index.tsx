import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

// tslint:disable:no-expression-statement
ReactDOM.render(<App />, document.getElementById("root"));

// TODO: make it registered
serviceWorker.unregister();
