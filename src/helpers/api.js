import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import Expo from 'expo';
import store from '../store'
import { login } from '../reducers/account'

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Accept'] = 'application/json';

export const API_HOST = process.env.NODE_ENV === 'production' ?
  '192.168.100.235:3000' :
  '192.168.100.235:3000'

const instance = axios.create({
  baseURL: `http://${API_HOST}/api`
});

instance.interceptors.response.use(res => res, async (err) => {
  if (err && err.response && err.response.status === 401) {
    // Back up guest account details for chance at recovery
    const pseudonym = await AsyncStorage.getItem('pseudonym')
    if (pseudonym.type === 'username') {
      const guestAccounts = JSON.parse(await AsyncStorage.getItem('guestAccounts') || null) || []
      guestAccounts.push(pseudonym)
      await AsyncStorage.setItem('guestAccounts', JSON.stringify(guestAccounts))
    }
    // Remove invalid token
    await AsyncStorage.removeItem('token')
    store.dispatch(NavigationActions.navigate({ routeName: 'Register' }))
  }
  if (err) {
    return Promise.reject(err);
  }
});

export const setAuthHeader = (token) => {
  instance.defaults.headers.common['Authorization'] = token
}

export const registerAccount = async (params) => {
  let res = await instance.post(`/accounts/register`, { ...params })
  return res.data
}

export const loginAccount = async (params) => {
  let res = await instance.post(`/accounts/login?include=user`, { ...params })
  return res.data
}

export const logoutAccount = async () => {
	await instance.post(`/accounts/logout`, {})
}

export const addAccountAddress = async (id, address) => {
  let res = await instance.post(`/accounts/${id}/address`, { address })
  return res.data
}

export const deleteAccountAddress = async (id, address) => {
  let res = await instance.delete(`/accounts/${id}/address/${address}`)
  return res.data
}

export const getAccount = async (id) => {
  let res = await instance.get(`/accounts/${id}`)
  return res.data
}

export const getAccountPortfolio = async (id) => {
  let res = await instance.get(`/accounts/${id}/portfolio`)
  return res.data
}

export const getTokenDetailsForAccount  = async (id, sym) => {
  let res = await instance.get(`/accounts/${id}/portfolio/token/${sym}`)
  return res.data
}

export const getAllTokens = async() => {
  let res = await instance.get('/Tokens');
  return res.data;
}