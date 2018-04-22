import { Alert, AsyncStorage, Share } from 'react-native'
import currencyFormatter from 'currency-formatter';
import { Permissions, Notifications, SecureStore, Constants } from 'expo';
import { NavigationActions } from 'react-navigation';
import {
    setAuthHeader,
    registerUserForPushNotifications,
    verifyTwoFactorAuth,
    fetchCoinbaseCredentials,
    googleLogin,
    coinbaseLogin
} from './api';
import { setLoading } from '../reducers/ui'
import { baseURL } from '../config'
import store from '../store/index';
import md5 from 'crypto-js/md5'
import Identicon from 'identicon.js/identicon'

export const mapAxis = (points, value, dimension) => {
    let start = 0
    let end = points.length - 1
    let mid = Math.floor((end - start) / 2)
    let point = null
    while ( start < end ) {
        const testPoint = points[mid]
        if (testPoint[dimension] > value) {
            end = mid - 1
        } else if (testPoint[dimension] < value) {
            start = mid + 1
        } else {
            break
        }
        mid = Math.floor((end+start)/2)
    }
    return points[mid]
}

export const genericError = () => {
    Alert.alert('API is busy, please try again in a few seconds. If the issue persists, please email support')
}

export const formatPrice = (price=0) => {
    price = Number(price)
    if (Number.isNaN(price)) {
        return 0
    }
    if (price < 1) {
        return price.toFixed(5)
    }
    let whole, decimal
    [whole, decimal] = price.toFixed(2).split('.')
    return `${Number(whole).toLocaleString()}.${decimal}`
}

export const formatCurrencyChange = (change) => {
    const sign = Number(change) > 0 ? '+$' : '-$'
    change = formatPrice(Math.abs(change))
    return sign + change
}

export const getError = (err) =>
  (err &&
    err.response &&
    err.response.data &&
    err.response.data.error) || err

export const getErrorMsg = (err) =>
  (getError(err) || {}).message

export const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    let userToken = await SecureStore.getItemAsync('token')
    await SecureStore.setItemAsync('notification_token', token)
    setAuthHeader(userToken)
    await registerUserForPushNotifications({token})
}

// Prevent progress spinner from getting stuck
export const safeAlert = (...args) => {
    const buttons = args[2] || [{text: 'OKtest'}]
    args[2] = buttons
    buttons.forEach((button)=>{
        const { onPress } = button
        button.onPress = () => {
            setLoading(false)
            onPress && onPress()
        }
    })

    const options = args[3] || {}
    const { onDismiss } = options

    args[3] = options
    options.onDismiss = () => {
        setLoading(false)
        onDismiss && onDismiss()
    }

    setTimeout(()=>Alert.alert.apply({}, args), 1)
}

export const getQueryString = (params) => {
    return Object.keys(params || {})
      .filter(k=>params[k]!==undefined)
      .map(k=>`${k}=${params[k]}`)
      .join('&')
}

export const getTokenImage = (symbol) => `${baseURL}/img/tokens/${symbol}.png`

export const getBlockchainImage = (name) => `${baseURL}/img/blockchains/${name.toLowerCase().replace(/\.|\-/g, '')}-icon.png`

export const getExchangeImage = (name) => `${baseURL}/img/exchanges/${name.toLowerCase().replace(/\.|\-/g, '')}-icon.png`

export const shareTokenDetails = (symbol) => {
    let link = `https://api.tokens.express/share/${symbol}`
    let content = { url: link, message: `${link}`}
    Share.share(content, { dialogTitle: `Share ${symbol} token` })
}

export const removeArrItem = function (inputArr, key, value) {
    const arr = [...inputArr]
    const removeIndex = arr.findIndex(item=>item[key]==value)
    if (removeIndex < 0) {
        return false
    }
    arr.splice(removeIndex, 1)
    return arr
}

export const get2FA = async function (id, dispatch) {
    return new Promise((resolve, reject)=>{
        dispatch(NavigationActions.navigate({
            routeName: 'Verify 2FA',
            params: {
                callback: async (token, cb) => {
                    try {
                        const res = await verifyTwoFactorAuth({ id, token, login: true })
                        resolve(res)
                    } catch (err) {
                        cb ? cb(false) : reject(err)
                    }
                },
                cancel: () => {
                    reject(null)
                }
            }
        }))
    })
}

export const asyncFilter = async (items, iter) => {
    const results = []
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        const keep = await iter(item)
        if (keep) {
            results.push(item)
        }
    }
    return results
}

const deepRoutes = {
    '/token/[a-zA-Z0-9]': {
        'screen': 'Token Details',
        'params': '[a-zA-Z0-9]*$'
    }
}

export const visitDeepLink = (url) => {
    // const req = url.replace(Constants.linkingUri, '')
    // let deepRoute
    // Object.keys(deepRoutes).some((route)=>{
    //     if (route.test(req)) {
    //         deepRoute = deepRoutes[route]
    //         return true
    //     }
    // })

    // switch (deepRoute.screen) {
    //     case 'Token Details':
    //         const symbol = req.match(new RegExp(deepRoute.params))[0]
    //         store.dispatch(NavigationActions.navigate({
    //             routeName: deepRoute.screen,
    //             params: { symbol }
    //         }))
    // }
}

export const identicon = (str, {size=150, margin=.3, background=[51,51,51,100]}={}) => {
  const strHash = md5(str).toString();
  const data = new Identicon(strHash, { size ,margin, background }).toString()
  return `data:image/png;base64,${data}`;
}

export const exchangeCoinbaseCodeForCredentials = async (code) => {
  const credentials = await fetchCoinbaseCredentials(code)
  return credentials
}

export const oauthLogin = (provider) => {
  switch(provider.toLowerCase()) {
    case 'google':
      return googleLogin;
    case 'coinbase':
      return coinbaseLogin;
  }
}