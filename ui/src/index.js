import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app';
import store from './store';
import { getRandomSubsector } from './actions';

store.dispatch(getRandomSubsector());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
