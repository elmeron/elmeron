import { act } from './util.js';
import elmeron from '../services/elmeron/index.js';
import * as card from './card.js';
import * as grid from './grid.js';
import * as player from './player.js';
import * as ui from './ui.js';
import * as world from './world.js';

export function initListeners() {
  return (dispatch) => {
    elmeron.on('getWorld', ({ children, name, parent, nodeType, tiles, explorationCost }) => {
      dispatch(world.setCurrentLocation(name));
      dispatch(world.setParentLocation(parent));
      dispatch(world.setChildrenLocations(children));
      dispatch(world.setNodeType(nodeType));
      dispatch(world.setExplorationCost(explorationCost));
      dispatch(world.setTiles(tiles));
      dispatch(grid.setExtremes(tiles));
      dispatch(card.closeCard());
    });

    elmeron.on('getPlayer', ({ fuel }) => {
      dispatch(player.setFuelData(fuel));
    });

    elmeron.on('gameStart', (data) => {
      const { fuel } = data.player;

      elmeron.getWorld();
      dispatch(ui.showGameView());
      dispatch(player.setFuelData(fuel));
    });

    elmeron.on('elmeronFound', ({ q, r }) => {
      dispatch(grid.focus({ q, r }));
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

    elmeron.on('refineryBuilt', ({ tiles, fuel }) => {
      dispatch(world.mergeTiles(tiles));
      dispatch(player.setFuelData(fuel));
      dispatch(card.closeCard());
    });

    elmeron.on('refineryChange', ({ tiles, fuel }) => {
      dispatch(world.mergeTiles(tiles));
      dispatch(player.setFuelData(fuel));
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

export function buildRefinery(tiles) {
  elmeron.buildRefinery(tiles);
  return act();
}
