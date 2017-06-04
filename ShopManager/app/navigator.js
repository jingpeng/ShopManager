import React from 'react';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  StackNavigator
} from 'react-navigation';

import LoginScreen from './screens/login-screen';
import MainScreen from './screens/main-screen';

export const Navigator = StackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
});

const Dispatcher = ({ dispatch, nav }) => (
  <Navigator navigation = { addNavigationHelpers({ dispatch, state: nav }) } />
);

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(Dispatcher);
