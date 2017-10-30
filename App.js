
import React from 'react';
import { AppRegistry, BackHandler, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { Analytics, PageHit } from 'expo-analytics';

import store from './src/store/index';
import { login } from './src/reducers/account'
import { Font } from 'expo';
import Sentry from 'sentry-expo';
import { NavigationActions } from "react-navigation";

import AppWithNavigationState from './src/navigators/AppNavigator';


Sentry.enableInExpoDevelopment = true;

const publicDNS = process.env.SENTRY_PUBLIC_DNS || 'https://bf77d4d2ce4843ae909cca0b6d7675bb@sentry.io/235327';
const analytics = new Analytics('UA-108735063-1');

analytics.hit(new PageHit('Home'));

Sentry.enableInExpoDevelopment = true;
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

	  BackHandler.addEventListener("onBackPress", this.goBack);

    this.setState({
      isReady: true
    })

    const token = await AsyncStorage.getItem('token')
    const id = await AsyncStorage.getItem('id')

    if (token && id) {
      store.dispatch(login())
    }
  }

  goBack = () => {
	  const { nav } = store.getState();
	  if (nav && nav.routes && nav.routes.length > 1) {
		  store.dispatch(NavigationActions.back());
		  return true;
	  }
	  return false;

  }

	componentWillUnmount() {
		BackHandler.removeEventListener("onBackPress", this.goBack);
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