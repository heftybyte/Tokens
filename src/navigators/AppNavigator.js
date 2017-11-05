import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import AccountsNavigator from '../components/Account';
import Splash from '../components/Splash';
import Dashboard from '../components/Dashboard';
import AddAddress from '../components/Account/AddAddress';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Register, { NormalRegistration, GuestRegistration } from '../components/Register';

export const AppNavigator = StackNavigator({
  Splash: { screen: Splash },
	NormalRegistration: { screen: NormalRegistration },
	GuestRegistration: { screen: GuestRegistration },
  Login: { screen: NormalRegistration },
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  'Add Address': { screen: AddAddress },
	Register: { screen: Register },
  TokenDetails: { screen: TokenDetails }
}, {
	headerMode: "none"
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
