import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import Expo, { SecureStore } from 'expo';
import store from '../store'
import { login } from '../reducers/account'
import { baseURL } from '../config'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Accept'] = 'application/json';

const instance = axios.create({
  baseURL: `${baseURL}/api`
});

instance.interceptors.response.use(res => res, async (err) => {
  const intercept = (
    err && err.response && err.response.status === 401 &&
    (
      err.response.data && err.response.data.error &&
      err.response.data.error.code !== 'LOGIN_FAILED'
    )
  )

  if (intercept) {
    // Back up guest account details for chance at recovery
    const pseudonym = JSON.parse(await AsyncStorage.getItem('pseudonym') || null)
    if (pseudonym && pseudonym.type === 'username') {
      const guestAccounts = JSON.parse(await AsyncStorage.getItem('guestAccounts') || null) || []
      guestAccounts.push(pseudonym)
      await AsyncStorage.setItem('guestAccounts', JSON.stringify(guestAccounts))
    }
    store.dispatch(NavigationActions.navigate({ routeName: 'Register' }))
  }
  return Promise.reject(err);
});

export const setAuthHeader = (token) => {
  instance.defaults.headers.common['Authorization'] = token
}

export const registerUserForPushNotifications = async (params) => {
	await instance.post(`accounts/push-token`, { ...params })
}

export const registerAccount = async (params) => {
  const res = await instance.post(`/accounts/register`, { ...params })
  return res.data
}

export const loginAccount = async (params) => {
  const res = await instance.post(`/accounts/login?include=user`, { ...params })
  return res.data
}

export const logoutAccount = async (notification_token) => {
	await instance.post(`/accounts/logout`, { notification_token })
}

export const addToAccountWatchlist = async (id, symbol) => {
	const res = await instance.post(`/accounts/${id}/watch-list`, { symbol })
	return res.data
}

export const removeFromAccountWatchlist = async (id, symbol) => {
	const res = await instance.delete(`/accounts/${id}/watch-list/${symbol}`)
	return res.data
}

export const addAccountAddress = async (id, address) => {
  const res = await instance.post(`/accounts/${id}/address`, { address })
  return res.data
}


export const refreshAccountAddress = async (id, address) => {
  const res = await instance.post(`/accounts/${id}/address/${address}/refresh`)
  return res.data
}

export const deleteAccountAddress = async (id, address) => {
  const res = await instance.delete(`/accounts/${id}/address/${address}`)
  return res.data
}

export const getAccount = async (id) => {
  const res = await instance.get(`/accounts/${id}`)
  return res.data
}

export const getAccountPortfolio = async (id) => {
  const res = await instance.get(`/accounts/${id}/portfolio`)
  return res.data
}

export const getTokenDetailsForAccount  = async (id, sym) => {
  const res = await instance.get(`/accounts/${id}/portfolio/token/${sym}`)
  return res.data
}

// must pass a checksum even if it's wrong
export const getAllTokens = async(checksum = '000') => {
  let res = await instance.get(`/tokens?checksum=${checksum}`);
  return res.data;
}

export const trackFeedActivity = async (feedItemId, accountId, type) => {
  instance.post(`/feed/${accountId}/action`, {feedItemId, accountId, type});
}

export const getNewsFeed = async (timestamp) => {
    const res = await instance.get(`/feed/latest?timestamp=${timestamp}`)
    return res.data;
}

export const getAppVersion = async () => {
    const res = await instance.get(`/appmeta/version`)
    return res.data
}

export const getPricedata = async (fsym='OMG',tsym='USD',format='chart') => {
    const res = await instance.get(`/ticker/prices/now?fsym=${fsym}&tsym=${tsym}&format=${format}`)
    return res.data
}

export const getHistoricalPricedata = async (fsym='OMG',tsym='USD',format='chart',period='1d') => {
    const res = await instance.get(`/ticker/price/historical?fsym=${fsym}&tsym=${tsym}&period=${period}&format=${format}`)
    return res.data
}

const log = (level) => (message, data) => {
    console.log({ message, data, level })
    instance.post('/client-logs', { message, data, level })
}

export const logger = {
    info: log('info'),
    debug: log('debug'),
    warning: log('warning'),
    notice: log('notice'),
    err: log('err'),
    crit: log('crit'),
    alert: log('alert'),
    emerg: log('emerg')
}

export const logLocalData = async () => {
    const localData = {}

    const token = await SecureStore.getItemAsync('token')
    const id = await SecureStore.getItemAsync('id')
    logger.info('SecureStore', { id, token })

    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
            stores.forEach((result, i, store) => {
                 // get at each store's key/value so you can work with it
                 let key = store[i][0];
                 let value = store[i][1];
                 if (key !== 'tokens' && key !== 'guestAccounts') {
                    localData[key] = value
                 }
            });
            logger.info('AsyncStorage', localData)
        });
    });


}