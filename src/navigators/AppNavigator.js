import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import AccountsNavigator from '../components/Account';
import Dashboard from '../components/Dashboard';
import NewAccount from '../components/Account/createAccount';
import ViewAccounts from '../components/Account/viewAccounts';

export const AppNavigator = StackNavigator({
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  NewAccount: { screen: NewAccount }
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
