import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import AccountsNavigator from '../components/Account';
import Entry from '../components/Entry';
import Dashboard from '../components/Dashboard';
import AddAddress from '../components/Account/AddAddress';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Search from '../components/Search';
import Chart from '../components/Chart';
import Register, { NormalRegistration, GuestRegistration } from '../components/Register';
import CardStackStyleInterpolator from 'react-navigation/lib/views/CardStack/CardStackStyleInterpolator';

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forFadeFromBottomAndroid(sceneProps);
  },
});

export const AppNavigator = StackNavigator({
  Entry: { screen: Entry },
  NormalRegistration: { screen: NormalRegistration },
  GuestRegistration: { screen: GuestRegistration },
  Login: { screen: NormalRegistration },
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  'Add Address': { screen: AddAddress },
  Search: { screen: Search },
  Register: { screen: Register },
  Chart: { screen: Chart },
  'Token Details': { screen: TokenDetails }
}, {
  headerMode: "none",
  cardStyle: {
    backgroundColor: '#000'
  },
  transitionConfig: customAnimationFunc
});



const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator
    navigation={addNavigationHelpers({ dispatch, state: nav })}
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
