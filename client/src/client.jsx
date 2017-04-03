import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/less/bootstrap.less';
import './style.less';
import '../static/fonts.less';
import store from './services/store.js';
import { setScreenDimension } from './ducks/ui.js';
import ViewDelegate from './components/ViewDelegate.jsx';

/**
 * Update screen state when window is resized and on initialization.
 */
function dimension() {
  const { innerWidth, innerHeight } = window;
  store.dispatch(setScreenDimension(innerWidth, innerHeight));
}

window.onresize = dimension;
dimension();


ReactDOM.render(
  <Provider store={store}>
    <ViewDelegate />
  </Provider>,
  document.getElementById('content')
);
