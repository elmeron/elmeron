import { fromJS, Map, Set } from 'immutable';
import { act, reducer } from './util.js';

const SET_TILES = 'world/SET_TILES';
const MERGE_TILES = 'world/MERGE_TILES';
const SET_CURRENT_LOCATION = 'world/SET_CURRENT_LOCATION';
const SET_PARENT_LOCATION = 'world/SET_PARENT_LOCATION';
const SET_CHILDREN_LOCATIONS = 'world/SET_CHILDREN_LOCATIONS';
const ADD_CHILDREN_LOCATIONS = 'world/ADD_CHILDREN_LOCATIONS';
const SET_NODE_TYPE = 'world/SET_NODE_TYPE';

const initialState = {
  tiles: {},
  location: {
    current: '',
    parent: '',
    children: new Set(),
  },
  nodeType: undefined,
};

export function setTiles(tiles) {
  return act(SET_TILES, tiles);
}

export function mergeTiles(tiles) {
  return act(MERGE_TILES, tiles);
}

export function setCurrentLocation(name) {
  return act(SET_CURRENT_LOCATION, name);
}

export function setParentLocation(name) {
  return act(SET_PARENT_LOCATION, name);
}

export function setChildrenLocations(children) {
  return act(SET_CHILDREN_LOCATIONS, children);
}

export function addChildrenLocations(children) {
  return act(ADD_CHILDREN_LOCATIONS, children);
}

export function setNodeType(type) {
  return act(SET_NODE_TYPE, type);
}

function handleSetTiles(state, tiles) {
  const reducedTiles = tiles.reduce((result, tile) => {
    const { q, r } = tile;
    const key = `${q},${r}`;
    return result.set(key, fromJS(tile));
  }, new Map());

  return state.setIn(['tiles'], reducedTiles);
}

function handleMergeTiles(state, tiles) {
  const reducedTiles = tiles.reduce((result, tile) => {
    const { q, r } = tile;
    const key = `${q},${r}`;
    return result.set(key, fromJS(tile));
  }, new Map());

  return state.mergeIn(['tiles'], reducedTiles);
}

function handleSetCurrentLocation(state, name) {
  return state.setIn(['location', 'current'], name);
}

function handleSetParentLocation(state, name) {
  return state.setIn(['location', 'parent'], name);
}

function handleSetChildrenLocations(state, children) {
  return state.setIn(['location', 'children'], fromJS(children));
}

function handleAddChildrenLocations(state, children) {
  const storedChildren = state.getIn(['location', 'children']);
  const concatenatedChildren = storedChildren.concat(fromJS(children));

  return state.setIn(['location', 'children'], concatenatedChildren);
}

function handleSetNodeType(state, type) {
  return state.set('nodeType', type);
}

const handlers = {
  [SET_TILES]: handleSetTiles,
  [MERGE_TILES]: handleMergeTiles,
  [SET_CURRENT_LOCATION]: handleSetCurrentLocation,
  [SET_PARENT_LOCATION]: handleSetParentLocation,
  [SET_CHILDREN_LOCATIONS]: handleSetChildrenLocations,
  [ADD_CHILDREN_LOCATIONS]: handleAddChildrenLocations,
  [SET_NODE_TYPE]: handleSetNodeType,
};

export default reducer(initialState, handlers);
