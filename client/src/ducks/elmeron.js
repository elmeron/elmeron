import { act } from './util.js';
import elmeron from '../services/elmeron/index.js';
import * as card from './card.js';
import * as grid from './grid.js';
import * as ui from './ui.js';
import * as world from './world.js';

export function initListeners() {
  return (dispatch) => {
    elmeron.on('getWorld', ({ children, name, parent, nodeType, tiles }) => {
      dispatch(world.setCurrentLocation(name));
      dispatch(world.setParentLocation(parent));
      dispatch(world.setChildrenLocations(children));
      dispatch(world.setNodeType(nodeType));
      dispatch(world.setTiles(tiles));
      dispatch(grid.setExtremes(tiles));
      dispatch(card.closeCard());
    });

    elmeron.on('gameStart', () => {
      elmeron.getWorld();
      dispatch(ui.showGameView());
    });

    elmeron.on('elmeronFound', () => {
      dispatch(ui.showGameOverView());
    });

    elmeron.on('explore', ({ tiles, worlds }) => {
      dispatch(world.mergeTiles(tiles));
      dispatch(grid.updateExtremes(tiles));
      dispatch(card.closeCard());

      if (worlds.length > 0) {
        dispatch(world.addChildrenLocations(worlds));
      }
    });
  };
}

export function zoomIn({ owner, q, r }) {
  elmeron.zoomIn(owner);
  return grid.zoomIn({ q, r });
}

export function zoomOut() {
  return (dispatch, getState) => {
    const parent = getState().world.getIn(['location', 'parent']);

    if (parent) {
      elmeron.zoomOut();
      dispatch(grid.zoomOut());
    } else {
      dispatch(act());
    }
  };
}

export function explore(tile) {
  elmeron.explore(tile);
  return act();
}
