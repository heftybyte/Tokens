import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import AccountsNavigator from '../components/Account';
import Dashboard from '../components/Dashboard';
import NewAccount from '../components/Account/CreateAccount';
import ViewAccounts from '../components/Account/ViewAccounts';
import TokenDetails from '../components/TokenDetails';
import Register, { NormalRegisteration, AnonymousRegisteration } from '../components/Register';

export const AppNavigator = StackNavigator({
	NormalRegisteration: { screen: NormalRegisteration },
	
	AnonymousRegisteration: { screen: AnonymousRegisteration },
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  NewAccount: { screen: NewAccount },
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
