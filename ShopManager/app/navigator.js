import React from 'react'
import { connect } from 'react-redux'
import {
  addNavigationHelpers,
  StackNavigator
} from 'react-navigation'

import AdScreen from './screens/ad-screen'
import GameScreen from './screens/game-screen'
import AllowanceScreen from './screens/allowance-screen'
import LoginScreen from './screens/login-screen'
import MainScreen from './screens/main-screen'
import PlaylistScreen from './screens/playlist-screen'
import SettingScreen from './screens/setting-screen'
import WelcomeScreen from './screens/welcome-screen'
import WebGameScreen from './screens/web-game-screen'
import PlayFullScreen from './screens/play-full-screen'

export const Navigator = StackNavigator({
  Ad: { screen: AdScreen },
  Game: { screen: GameScreen },
  Allowance: { screen: AllowanceScreen },
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Playlist: { screen: PlaylistScreen },
  Setting: { screen: SettingScreen },
  Welcome: { screen: WelcomeScreen },
  WebGame: { screen: WebGameScreen },
  PlayFull: { screen: PlayFullScreen }
})

const Dispatcher = ({ dispatch, nav }) => (
  <Navigator navigation = { addNavigationHelpers({ dispatch, state: nav }) } />
)

const mapStateToProps = state => ({
  nav: state.nav
})

export default connect(mapStateToProps)(Dispatcher)
