import { combineReducers } from 'redux'
import { NavigationActions } from 'react-navigation'

import { Navigator } from './navigator'

const actionWelcome = Navigator.router.getActionForPathAndParams('Welcome')
const navStateWelcome = Navigator.router.getStateForAction(actionWelcome)
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
const actionAllowance = Navigator.router.getActionForPathAndParams('Allowance')
const actionPlaylist = Navigator.router.getActionForPathAndParams('Playlist')
const actionWebGame = Navigator.router.getActionForPathAndParams('WebGame')
const actionPlayFull = Navigator.router.getActionForPathAndParams('PlayFull')

function nav(state = navStateWelcome, action) {
  let nextState
  switch (action.type) {
    case 'Welcome':
      nextState = { ...navStateSetting2Login, defaultPlace: action.defaultPlace }
      break
    case 'Login':
      nextState = { ...navStateAd2Setting, userData: action.userData, deviceData: action.deviceData }
      console.log(nextState)
      break
    case 'Ad':
      nextState = { ...navStateAd, deviceData: action.deviceData }
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
    case 'Allowance':
      tmpState = Navigator.router.getStateForAction(
        actionAllowance,
        state
      )
      nextState = { ...tmpState, data: action.data }
      break
    case 'Allowance2Ad':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'Playlist':
      tmpState = Navigator.router.getStateForAction(
        actionPlaylist,
        state
      )
      nextState = { ...tmpState, advs: action.advs }
      break
    case 'Game2Ad':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'Playlist2Ad':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'WebGame':
      var tmpState = Navigator.router.getStateForAction(
        actionWebGame,
        state
      )
      nextState = { ...tmpState, uri: action.uri, parent: action.parent }
      break
    case 'PlayFull':
      var tmpState = Navigator.router.getStateForAction(
        actionPlayFull,
        navStateAd
      )
      nextState = { ...tmpState, data: action.data }
      break
    case 'PlayFull2Ad':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
        state
      )
      break
    case 'WebGame2Game':
      nextState = Navigator.router.getStateForAction(
        NavigationActions.back(),
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
