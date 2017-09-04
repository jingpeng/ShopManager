import React, { Component } from 'react'
import { AppRegistry, AsyncStorage } from 'react-native'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Storage from 'react-native-storage'

import Reducer from './app/reducer'
import Dispatcher from './app/navigator'

var storage = new Storage({
	size: 1000, // maximum capacity, default 1000
	storageBackend: AsyncStorage, // Use AsyncStorage for RN, or window.localStorage for web. If not set, data would be lost after reload.
	defaultExpires: 1000 * 3600 * 24, // expire time, default 1 day(1000 * 3600 * 24 milliseconds). can be null, which means never expire.
	enableCache: true, // cache data in the memory. default is true.
	// if data was not found in storage or expired, the corresponding sync method will be invoked and return the latest data.
	sync : {
		// we'll talk about the details later.
	}
})
global.storage = storage
global.popupAd = false

export default class ShopManager extends Component {
  store = createStore(Reducer)

  render() {
    return (
      <Provider store={this.store}>
        <Dispatcher />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ShopManager', () => ShopManager)
