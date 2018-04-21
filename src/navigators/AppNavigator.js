import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { ICOs, ICODetail } from "../components/Ico"

import Education from '../components/Education';
import Entry from '../components/Entry';
import Dashboard from '../components/Common/Dashboard';
import AccountDashboard from '../components/Account/AccountDashboard'
import AccountType from '../components/Account/AccountType'
import AccountPicker from '../components/Account/AccountPicker'
import AddAddress from '../components/Account/AddAddress';
import TokenDetails from '../components/TokenDetails';
import Chat from "../components/Chat/Chat"
import Profile from '../components/Profile';
import Search from '../components/Search';
import BookMarks from '../components/NewsFeed/BookMark';
import Register from '../components/Register';
import SignUp from '../components/Register/SignUp';
import Login from '../components/Register/Login';
import PriceAlert from '../components/PriceAlert';
import EditProfile from '../components/Profile/EditProfile';
import SetCurrency from '../components/Profile/SetCurrency';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { baseColor } from '../config'
// Wallet
import Wallet from '../components/Wallet';
import RestoreWallet from '../components/Wallet/RestoreWallet';
import NewWallet from '../components/Wallet/NewWallet';
import SendTransaction from '../components/Wallet/SendTransaction'
import ConfirmPhrase from '../components/Wallet/ConfirmPhrase';
import NewExchangeAccount from '../components/ExchangeAccount/NewExchangeAccount';
import NewExchangeOrder from '../components/ExchangeAccount/NewExchangeOrder';
import Settings from '../components/Settings';
import SecuritySettings from '../components/Settings/SecuritySettings'
import SetPin from '../components/Settings/SecuritySettings/setpin';
import TwoFactorAuth from '../components/Settings/TwoFactorAuth';
import ConfirmTwoFactorAuth from '../components/Settings/TwoFactorAuth/ConfirmTwoFactorAuth';
import VerifyTwoFactorAuth from '../components/Settings/TwoFactorAuth/VerifyTwoFactorAuth';

import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forFadeFromBottomAndroid(sceneProps);
  },
});

export const Routes = {
  Chat: {
    screen: Chat
  },
  Education: { screen: Education },
  Entry: { screen: Entry },
  'Account View': { screen: AccountDashboard },
  'Select Account': { screen: AccountPicker },
  'Add Address': { screen: AddAddress },
  Search: { screen: Search },
  Bookmarks: { screen: BookMarks },
  'Register': { screen: Register },
  'SignUp': { screen: SignUp },
  'Login': { screen: Login },
  'Token Details': { screen: TokenDetails },
  'Wallet': { screen: Wallet},
  'New Wallet': {screen: NewWallet},
  'Restore Wallet': {screen: RestoreWallet},
  'Confirm Phrase': {screen: ConfirmPhrase},
  'SendTransaction': { screen: SendTransaction },
  'NewExchangeAccount': { screen: NewExchangeAccount },
  'NewExchangeOrder': { screen: NewExchangeOrder },
  'Price Alert': { screen: PriceAlert },
  'Profile': Profile,
  'Settings': {screen: Settings},
  'SecuritySettings': {screen: SecuritySettings},
  'SetPin': {screen: SetPin},
  '2FA': {screen: TwoFactorAuth},
  'Confirm 2FA': {screen: ConfirmTwoFactorAuth},
  'Verify 2FA': { screen: VerifyTwoFactorAuth },
  'ICO List': {
    screen: ICOs
  },
  'AccountType': {
    screen: AccountType
  },
  ICODetail: {
    screen: ICODetail
  },
  'Edit Profile': {
    screen: EditProfile
  },
  'Set Currency': {
    screen: SetCurrency
  }
}

export const AppNavigator = StackNavigator(
  Routes,
  {
    initialRouteName: "Entry",
    headerMode: "none",
    cardStyle: {
      backgroundColor: baseColor
    },
   transitionConfig: customAnimationFunc
  }
);

export const navMiddleWare = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);const addListener = createReduxBoundAddListener("root");


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
