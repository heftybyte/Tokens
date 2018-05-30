
import React from 'react';
import { AppRegistry, BackHandler, Linking, Platform, Alert } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/index';
import { login } from './src/reducers/account'
import { AppLoading, Constants, Font, SecureStore, Util } from 'expo';
import Sentry from 'sentry-expo';
import { NavigationActions } from "react-navigation";
import AppWithNavigationState from './src/navigators/AppNavigator';
import './src/helpers/polyfill'
import { logger, logLocalData } from './src/helpers/api'
import { visitDeepLink } from './src/helpers/functions'
import { baseColor } from './src/config'
import './src/helpers/notifications'

const ENVIRONMENT = Constants.isDevice ? 'production' : 'development'
const DEFAULT_SPLASH_DELAY = 3000

Sentry.enableInExpoDevelopment = true;
const publicDSN = process.env.SENTRY_PUBLIC_DSN || 'https://af6c590a432d4ef49746f9d2fc8a4b8e@sentry.io/242835'

if (ENVIRONMENT !== 'development') {
    Sentry.config(publicDSN).install();
}

logger.info(`current environment: ${ENVIRONMENT}`)
logLocalData()
class Tokens extends React.Component {
    state = {
        isReady: false,
        reload: false
    }
    async componentDidMount() {
        const firstRun = !(await SecureStore.getItemAsync('postfirstRun'))
        logger.info('From App.js', { firstRun })
        if (firstRun) {
            SecureStore.setItemAsync('postfirstRun', JSON.stringify(true))
            Util.reload()
        }
        await Promise.all([
            Font.loadAsync({
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
            }),
            this.defaultDealy()
        ])

        this.setState({
            isReady: true
        })

        BackHandler.addEventListener("onBackPress", this.goBack);

        const token = await SecureStore.getItemAsync('token')
        const id = await SecureStore.getItemAsync('id')

        logger.info('From App.js', { token, id })
        if (Platform.OS === 'android') {
            Util.addNewVersionListenerExperimental(()=>Util.reload())
        }
        if (token && id) {
            await store.dispatch(login())
        } else {
            store.dispatch(NavigationActions.navigate({ routeName: 'Register' }))
        }

        Linking.addEventListener('url', this.handleDeepLink);
    }

    handleDeepLink = async (event) => {
        const { url } = event
        visitDeepLink(url)
    }

    goBack = () => {
        const { nav } = store.getState();
        if (nav && nav.routes && nav.routes.length > 1) {
            store.dispatch(NavigationActions.back());
            return true;
        }
        return false;
    }

    defaultDealy = () => {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve()
            }, DEFAULT_SPLASH_DELAY)
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("onBackPress", this.goBack);
        Linking.removeEventListener('url', this.handleDeepLink);
    }

    render() {
        const { isReady, reload } = this.state


        return isReady ? (
                <Provider style={{backgroundColor: baseColor}} store={store}>
                    { <AppWithNavigationState /> }
                </Provider>
            ) :
            <AppLoading />
    }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;