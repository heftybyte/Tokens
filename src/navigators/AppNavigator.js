import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import AccountsNavigator from '../components/Account';
import Dashboard from '../components/Dashboard';
import NewAccount from '../components/Account/CreateAccount';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Search from '../components/Search';
import Register, { NormalRegisteration, AnonymousRegisteration } from '../components/Register';

export const AppNavigator = StackNavigator({
	NormalRegistration: { screen: NormalRegistration },
	GuestRegistration: { screen: GuestRegistration },
  Login: { screen: NormalRegistration },
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  NewAccount: { screen: NewAccount },
  TokenDetails: { screen: TokenDetails },
  Search: { screen: Search },
	Register: { screen: Register },
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
