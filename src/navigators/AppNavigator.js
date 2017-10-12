import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { observable, action } from "mobx"

import AccountsNavigator from '../components/Account';
import Dashboard from '../components/Dashboard';
import NewAccount from '../components/Account/CreateAccount';
import ViewAccounts from '../components/Account/ViewAccounts';
import { store } from "./store"

export const AppNavigator = StackNavigator({
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  NewAccount: { screen: NewAccount }
});

store.setNavigator(AppNavigator)

const AppWithNavigationState = () => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch: store.dispatch, state: store.navigationState })} />
);


export default observer(AppWithNavigationState);
