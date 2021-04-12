import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import "./style.css"
import 'antd/dist/antd.css';


import App from './components/App';
import reducers from './reducers';

// Development only axios helpers!
import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(reduxThunk)));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#root')
);
