import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/root';

import configureStore from './store';
import { getRandomSubsector } from './modules/subsector';

const store = configureStore();

store.dispatch(getRandomSubsector());


ReactDOM.render(
  <Root store={store} />,
  document.getElementById('app')
);
