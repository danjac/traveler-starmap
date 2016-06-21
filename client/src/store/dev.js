import { createStore, compose, applyMiddleware } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import DevTools from '../containers/devtools';
import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(thunk, createLogger()),
  DevTools.instrument(),
  persistState(
    window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
  )
);


export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }
  return store;
}
