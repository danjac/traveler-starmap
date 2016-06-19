import React from 'react';
import { Provider } from 'react-redux';

import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import App from '../app';


export const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
  >
    <LogMonitor />
  </DockMonitor>
);


export default class Root extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
  };
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
