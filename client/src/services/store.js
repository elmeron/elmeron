import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from '../ducks';

/* eslint-disable */
export default createStore(
  combineReducers(reducers),
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
/* eslint-enable */
