import { combineReducers } from 'redux'
import { NavigationActions } from 'react-navigation'

import { Navigator } from './navigator'

// Start with two routes: The Main screen, with the Login screen on top.
const actionAd = Navigator.router.getActionForPathAndParams('Ad')
const navStateAd = Navigator.router.getStateForAction(actionAd)
const actionSetting = Navigator.router.getActionForPathAndParams('Setting')
const navStateSetting = Navigator.router.getStateForAction(actionSetting)
const actionLogin = Navigator.router.getActionForPathAndParams('Login')
const navStateAd2Setting = Navigator.router.getStateForAction(
  actionSetting,
  navStateAd
)
const navStateSetting2Login = Navigator.router.getStateForAction(
  actionLogin,
  navStateAd2Setting
)
const actionGame = Navigator.router.getActionForPathAndParams('Game')
const actionPlaylist = Navigator.router.getActionForPathAndParams('Playlist')

function nav(state = navStateSetting2Login, action) {
  let nextState
  switch (action.type) {
    case 'Login':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'Setting':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'Game':
      nextState = Navigator.router.getStateForAction(
        actionGame,
        state
      )
      break
    case 'Playlist':
      nextState = Navigator.router.getStateForAction(
        actionPlaylist,
        state
      )
      break
    default:
      nextState = Navigator.router.getStateForAction(action, state)
      break
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state
}

const initialAuthState = { isLoggedIn: false }

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true }
    default:
      return state
  }
}

const Reducer = combineReducers({
  nav,
  auth
})

export default Reducer
