
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Font } from 'expo';
import Sentry from 'sentry-expo';

import store from './src/store/index';
import AppWithNavigationState from './src/navigators/AppNavigator';

Sentry.enableInExpoDevelopment = true;

const publicDNS = process.env.SENTRY_PUBLIC_DNS || 'https://bf77d4d2ce4843ae909cca0b6d7675bb@sentry.io/235327';

Sentry.config(publicDNS).install();

class Tokens extends React.Component {
  state = {
    isReady: false
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Raleway': require('./assets/fonts/Raleway-Regular.ttf'),
      'Raleway-Light': require('./assets/fonts/Raleway-Light.ttf'),
      'Dosis': require('./assets/fonts/Dosis-Regular.ttf'),
      'Dosis-Light': require('./assets/fonts/Dosis-Light.ttf'),
      'Dosis-Bold': require('./assets/fonts/Dosis-Bold.ttf'),
      'Khula': require('./assets/fonts/Khula-Regular.ttf'),
      'Khula-Light': require('./assets/fonts/Khula-Light.ttf'),
      'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
      'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
      'Nunito-ExtraLight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
    })

    this.setState({
      isReady: true
    })
  }

  render() {
    const { isReady } = this.state
    return isReady && (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;