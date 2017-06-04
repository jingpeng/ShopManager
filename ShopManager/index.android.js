import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Reducer from './app/reducer';
import Dispatcher from './app/navigator';

export default class ShopManager extends Component {
  store = createStore(Reducer);

  render() {
    return (
      <Provider store={this.store}>
        <Dispatcher />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ShopManager', () => ShopManager);
