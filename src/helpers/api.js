import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import Expo, { SecureStore } from 'expo';
import store from '../store'
import { login } from '../reducers/account'
import { getQueryString } from '../helpers/functions'
import { baseURL } from '../config'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Accept'] = 'application/json';

// const bitcore = require('bitcore-lib')
const bitcoin = require('bitcoinjs-lib')


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
  console.log({err})
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

export const addAccountWalletAddress = async (id, address, platform) => {
  const res = await instance.post(`/accounts/${id}/wallets`, { address, platform })
  return res.data
}

export const deleteAccountWalletAddress = async(id, address) => {
    const res = await instance.delete(`/accounts/${id}/wallets/${address}`)
    return res.data
}

export const setCurrency = async (id, currency) => {
  const res = await instance.post(`/accounts/${id}/preferences/currency/${currency}`)
  return res.data
}

export const addExchangeAccount = async ({ id, key, secret, name, passphrase, exchangeId }) => {
  const res = await instance.post(`/accounts/${id}/exchangeAccounts`, { key, secret, name, passphrase, exchangeId })
  return res.data
}

export const deleteExchangeAccount = async(id, exchangeAccountId) => {
  const res = await instance.delete(`/accounts/${id}/exchangeAccounts/${exchangeAccountId}`)
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

export const getAccountPortfolioChart = async (id, period) => {
  const res = await instance.get(`/accounts/${id}/portfolio-chart?period=${period}`)
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

export const getNewsFeed = async (accountId) => {
    const res = await instance.get(`/feed/${accountId}/latest`)
    return res.data;
}

export const trackFeedView = async (accountId, itemId) => {
    const res = await instance.post(`/feed/${accountId}/item/${itemId}/view`)
    return res.data;
}

export const getAppVersion = async () => {
    const res = await instance.get(`/appmeta/version`)
    return res.data
}

export const bookMark = async (id, bookmark) => {
    let res = await instance.get(`/accounts/${id}/bookmarks/${bookmark.id}`, { bookmark })
    return res.data
}

export const getPrices = async ({fsyms,tsyms='USD'}) => {
    const res = await instance.get(`/ticker/prices/now?fsyms=${fsyms}&tsym=${tsyms}`)
    return res.data
}

export const getHistoricalPrices = async ({fsyms,tsyms='USD',start=0,end=0,format='chart',period,interval}) => {
    const queryString = getQueryString({fsyms,tsyms,start,end,format,period,interval})
    const res = await instance.get(`/ticker/prices/historical?${queryString}`)
    return res.data
}

export const getGasPrices = async () => {
  const url = "https://ethgasstation.info/json/ethgasAPI.json";
  const res = await instance.get(url)
  return res.data
}

export const getBlockchains = async () => {
    const res = await instance.get(`/Blockchains`)
    return res.data;
}

export const getExchanges = async () => {
    const res = await instance.get(`/Exchanges`)
    return res.data;
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