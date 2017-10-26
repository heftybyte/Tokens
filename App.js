
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import { Analytics, PageHit } from 'expo-analytics';

import store from './src/store/index';

import AppWithNavigationState from './src/navigators/AppNavigator';

import Sentry from 'sentry-expo';

const publicDNS = process.env.SENTRY_PUBLIC_DNS || 'https://bf77d4d2ce4843ae909cca0b6d7675bb@sentry.io/235327';
const analytics = new Analytics('UA-108735063-1');

analytics.hit(new PageHit('Home'));

Sentry.enableInExpoDevelopment = true;
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