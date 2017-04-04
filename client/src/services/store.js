import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from '../ducks';

const dev = process.env.NODE_ENV === 'development';
/* eslint-disable */
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
/* eslint-enable */
const middleware = applyMiddleware(thunk);
const comp = dev ? compose(middleware, devTools) : middleware;

export default createStore(combineReducers(reducers), comp);
