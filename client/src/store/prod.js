import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

import rootReducer from '../reducers';

export default function (initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk, logger));
}
