
import React from 'react';
import { AppRegistry, BackHandler, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/index';
import { login } from './src/reducers/account'
import { getAppVersion } from './src/helpers/api'
import { AppLoading, Font, SecureStore } from 'expo';
import Sentry from 'sentry-expo';
import { NavigationActions } from "react-navigation";
import AppWithNavigationState from './src/navigators/AppNavigator';
import PromptReload from './src/components/Entry/PromptReload';
require('number-to-locale-string')

Sentry.enableInExpoDevelopment = true;
const publicDSN = process.env.SENTRY_PUBLIC_DSN || 'https://af6c590a432d4ef49746f9d2fc8a4b8e@sentry.io/242835'
Sentry.config(publicDSN).install();


class Tokens extends React.Component {
    state = {
        isReady: false,
        reload: false
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

        if(Platform.OS === 'android') {
            let err = null
            const appVersion = await SecureStore.getItemAsync('appVersion')
            const newAppVersion = await getAppVersion().catch(e=>err=e)
            if (appVersion !== newAppVersion) {
                await SecureStore.setItemAsync('appVersion', newAppVersion.toString())
                this.setState({reload: true})
            }
        }

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
        const { isReady, reload } = this.state

        return isReady && (
                <Provider style={{backgroundColor: '#000'}} store={store}>
                    { reload ? <PromptReload /> : <AppWithNavigationState /> }
                </Provider>
            )
    }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;