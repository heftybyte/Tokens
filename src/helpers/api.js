import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import Expo from 'expo';
import store from '../store'
import { login } from '../reducers/account'

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Accept'] = 'application/json';

export const API_HOST = '138.197.104.147:3000'

const instance = axios.create({
  baseURL: `http://${API_HOST}/api`
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

export const logoutAccount = async () => {
	await instance.post(`/accounts/logout`, {})
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

export const bookMark = async (id, news) => {
    let res = await instance.get(`/accounts/${id}/bookmarks/${news.id}`, { news })
    return res.data
}
