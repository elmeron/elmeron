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
import {
  setTiles,
  mergeTiles,
  setCurrentLocation,
  setParentLocation,
  setChildrenLocations,
  addChildrenLocations,
  setNodeType,
} from './ducks/world.js';
import ViewDelegate from './components/ViewDelegate.jsx';

/**
 * Setup Elmeron listeners.
 */
elmeron.on('getWorld', ({ children, name, parent, nodeType, tiles }) => {
  store.dispatch(setCurrentLocation(name));
  store.dispatch(setParentLocation(parent));
  store.dispatch(setChildrenLocations(children));
  store.dispatch(setNodeType(nodeType));
  store.dispatch(setTiles(tiles));
  store.dispatch(closeCard());
});

elmeron.on('gameStart', ({ children, name, parent, nodeType, tiles }) => {
  elmeron.getWorld();
  store.dispatch(showGameView());
});

elmeron.on('explore', ({ tiles, worlds }) => {
  console.log(tiles, worlds);

  store.dispatch(mergeTiles(tiles));
  store.dispatch(updateExtremes(tiles));
  store.dispatch(closeCard());

  if (worlds.length > 0) {
    store.dispatch(addChildrenLocations(worlds));
  }
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
