import React from 'react';
import { Provider } from 'react-redux';

import App from '../app';
import DevTools from '../devtools';


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
