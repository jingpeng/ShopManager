import React from 'react'
import { connect } from 'react-redux'
import {
  addNavigationHelpers,
  StackNavigator
} from 'react-navigation'

import AdScreen from './screens/ad-screen'
import GameScreen from './screens/game-screen'
import LoginScreen from './screens/login-screen'
import MainScreen from './screens/main-screen'
import PlaylistScreen from './screens/playlist-screen'
import SettingScreen from './screens/setting-screen'
import WelcomeScreen from './screens/welcome-screen'

export const Navigator = StackNavigator({
  Ad: { screen: AdScreen },
  Game: { screen: GameScreen },
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Playlist: { screen: PlaylistScreen },
  Setting: { screen: SettingScreen },
  Welcome: { screen: WelcomeScreen }
})

const Dispatcher = ({ dispatch, nav }) => (
  <Navigator navigation = { addNavigationHelpers({ dispatch, state: nav }) } />
)

const mapStateToProps = state => ({
  nav: state.nav
})

export default connect(mapStateToProps)(Dispatcher)
