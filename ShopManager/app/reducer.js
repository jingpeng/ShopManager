import { combineReducers } from 'redux'
import { NavigationActions } from 'react-navigation'

import { Navigator } from './navigator'

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = Navigator.router.getActionForPathAndParams('Main')
const tempNavState = Navigator.router.getStateForAction(firstAction)
const secondAction = Navigator.router.getActionForPathAndParams('Login')
const initialNavState = Navigator.router.getStateForAction(
  secondAction,
  tempNavState
)

function nav(state = initialNavState, action) {
  let nextState
  switch (action.type) {
    case 'Login':
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
