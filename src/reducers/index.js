import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Dashboard screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Dashboard');
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    default:
      // for some reason the next state return is still for dashboard
      // we force getting the correct action by calling 
      // AppNavigator.router.getActionForPathAndParams with the action type
      nextRouteAction = AppNavigator.router.getActionForPathAndParams(action.type) || action;
      nextState = AppNavigator.router.getStateForAction(nextRouteAction, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
});

export default AppReducer;
