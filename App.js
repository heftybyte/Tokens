
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/index';

import AppWithNavigationState from './src/navigators/AppNavigator';

import Sentry from 'sentry-expo';

Sentry.enableInExpoDevelopment = true;

const publicDNS = process.env.SENTRY_PUBLIC_DNS || 'https://bf77d4d2ce4843ae909cca0b6d7675bb@sentry.io/235327';

Sentry.config(publicDNS).install();

class Tokens extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;