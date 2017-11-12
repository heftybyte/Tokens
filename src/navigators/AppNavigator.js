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
import Register, { NormalRegistration, GuestRegistration } from '../components/Register';

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
  'Token Details': { screen: TokenDetails }
}, {
	headerMode: "none",
  cardStyle: {
    backgroundColor: '#000'
  }
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
