import React from 'react'
import { connect } from 'react-redux'
import {
  addNavigationHelpers,
  StackNavigator
} from 'react-navigation'

import AdScreen from './screens/ad-screen'
import LoginScreen from './screens/login-screen'
import MainScreen from './screens/main-screen'
import PlaylistScreen from './screens/playlist-screen'
import SettingScreen from './screens/setting-screen'

export const Navigator = StackNavigator({
  Ad: { screen: AdScreen },
  Login: { screen: PlaylistScreen },
  Main: { screen: MainScreen },
  Playlist: { screen: PlaylistScreen },
  Setting: { screen: SettingScreen }
})

const Dispatcher = ({ dispatch, nav }) => (
  <Navigator navigation = { addNavigationHelpers({ dispatch, state: nav }) } />
)

const mapStateToProps = state => ({
  nav: state.nav
})

export default connect(mapStateToProps)(Dispatcher)
