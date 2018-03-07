import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { ICOs, ICODetail } from "../components/Ico"

import AccountsNavigator from '../components/Account';
import Education from '../components/Education';
import Entry from '../components/Entry';
import Dashboard from '../components/Dashboard';
import AddAddress from '../components/Account/AddAddress';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Search from '../components/Search';
import BookMarks from '../components/NewsFeed/BookMark';
import Wallet from '../components/Wallet';
import Register, { NormalRegistration, GuestRegistration } from '../components/Register';
import PriceAlert from '../components/PriceAlert';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

// Wallet
import RestoreWallet from '../components/Wallet/RestoreWallet';

import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forFadeFromBottomAndroid(sceneProps);
  },
});

export const AppNavigator = StackNavigator({
  Education: { screen: Education },
  Entry: { screen: Entry },
  NormalRegistration: { screen: NormalRegistration },
  GuestRegistration: { screen: GuestRegistration },
  Login: { screen: NormalRegistration },
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  'Add Address': { screen: AddAddress },
  Search: { screen: Search },
  Bookmarks: { screen: BookMarks },
  Register: { screen: Register },
  'Token Details': { screen: TokenDetails },
  'Price Alert': { screen: PriceAlert },
  'ICO List': { screen: ICOs },
   ICODetail: { screen: ICODetail },
   Wallet: { screen: Wallet},
    'Create Wallet': {screen: RestoreWallet}
}, {
	initialRouteName: "ICOList",
  headerMode: "none",
  cardStyle: {
    backgroundColor: '#000'
  },
  transitionConfig: customAnimationFunc
});

export const navMiddleWare = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");


const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator
    navigation={addNavigationHelpers({
      dispatch,
      state: nav,
      addListener
    })}
  />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
