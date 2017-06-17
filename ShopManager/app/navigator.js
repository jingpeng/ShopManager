import React from 'react';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator
} from 'react-navigation';

import LoginScreen from './screens/login-screen';
import MainScreen from './screens/main-screen';
import SettingScreen from './screens/setting-screen';
import PlaylistScreen from './screens/playlist-screen';

export const Navigator = StackNavigator({
  Login: { screen: PlaylistScreen },
  Main: { screen: MainScreen },
  Setting: { screen: SettingScreen },
  Playlist: { screen: PlaylistScreen }
});

const Dispatcher = ({ dispatch, nav }) => (
  <Navigator navigation = { addNavigationHelpers({ dispatch, state: nav }) } />
);

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(Dispatcher);
