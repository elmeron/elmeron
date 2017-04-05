import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/less/bootstrap.less';
import './style.less';
import '../static/fonts.less';
import elmeron from './services/elmeron/index.js';
import store from './services/store.js';
import { closeCard } from './ducks/card.js';
import { updateExtremes } from './ducks/grid.js';
import { setScreenDimension, showGameView } from './ducks/ui.js';
import { mergeTiles } from './ducks/world.js';
import ViewDelegate from './components/ViewDelegate.jsx';

/**
 * Setup Elmeron listeners.
 */
elmeron.on('getTiles', (tiles) => {
  store.dispatch(mergeTiles(tiles));
  store.dispatch(updateExtremes(tiles));
  store.dispatch(showGameView());
});

elmeron.on('gameStart', () => {
  elmeron.getTiles();
});

elmeron.on('explore', (tiles) => {
  store.dispatch(mergeTiles(tiles));
  store.dispatch(updateExtremes(tiles));
  store.dispatch(closeCard());
});


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
