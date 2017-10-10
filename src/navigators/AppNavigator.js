import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { observable, action } from "mobx"

import AccountsNavigator from '../components/Account';
import Dashboard from '../components/Dashboard';
import NewAccount from '../components/Account/CreateAccount';
import ViewAccounts from '../components/Account/ViewAccounts';

export const AppNavigator = StackNavigator({
  Dashboard: { screen: Dashboard },
  Accounts : { screen: ViewAccounts },
  NewAccount: { screen: NewAccount }
});


class Navigation {
  @observable headerTitle = "Dashboard"
  @observable.ref navigationState = {
    index: 0,
    routes: [
      { key: "Dashboard", routeName: "Dashboard" },
		],
  }

  @action dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    return this.navigationState = AppNavigator
        .router
				.getStateForAction(action, previousNavState);
	}
}

const store = new Navigation()

const AppWithNavigationState = () => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch: store.dispatch, state: store.navigationState })} />
);


export default observer(AppWithNavigationState);
