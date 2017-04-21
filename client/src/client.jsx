import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/less/bootstrap.less';
import 'font-awesome/less/font-awesome.less';
import './style.less';
import '../static/fonts.less';
import elmeron from './services/elmeron/index.js';
import store from './services/store.js';
import { setScreenDimension } from './ducks/ui.js';
import { initListeners } from './ducks/elmeron.js';
import ViewDelegate from './components/ViewDelegate.jsx';

/**
 * Setup Elmeron listeners.
 */
store.dispatch(initListeners());

/**
 * Update screen state when window is resized and on initialization.
 */
function dimension() {
  const { innerWidth, innerHeight } = window;
  store.dispatch(setScreenDimension(innerWidth, innerHeight));
}

window.onresize = dimension;
dimension();

elmeron.startGame('Test player');

ReactDOM.render(
  <Provider store={store}>
    <ViewDelegate />
  </Provider>,
  document.getElementById('content')
);
