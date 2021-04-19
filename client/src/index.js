import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import "./css/home.css"
import "./css/ActiveUsers.css"
import "./css/Chat.css"
import "./css/game.css"
import "./css/home.css"
import "./css/InfoBar.css"
import "./css/Input.css"
import "./css/Join.css"
import "./css/Message.css"
import "./css/Messages.css"

 
import App from './components/App';
import reducers from './reducers';

import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(reduxThunk)));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#root')
);
