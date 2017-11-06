
import React from 'react';
import { AppRegistry, BackHandler, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/index';
import { login } from './src/reducers/account'
import { AppLoading, Font, SecureStore } from 'expo';
import Sentry from 'sentry-expo';
import { NavigationActions } from "react-navigation";
import AppWithNavigationState from './src/navigators/AppNavigator';
require('number-to-locale-string')

Sentry.enableInExpoDevelopment = true;

const publicDNS = process.env.SENTRY_PUBLIC_DNS || 'https://473f8d321a8b4a4499a9502a2fde6bfc:4b80cf6ab73e434a8356429ba17a613a@sentry.io/240860'

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


    const token = await SecureStore.getItemAsync('token')
    const id = await SecureStore.getItemAsync('id')

    if (token && id) {
      await store.dispatch(login())
    } else {
        store.dispatch(NavigationActions.navigate({ routeName: 'Register' }))
    }

    this.setState({
      isReady: true
    })
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
      <Provider style={{backgroundColor: '#000'}} store={store}>
        <AppWithNavigationState />
      </Provider>
    ) 
  }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;