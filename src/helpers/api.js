import { AsyncStorage } from 'react-native';
import axios from 'axios';
import Expo from 'expo';
import store from '../store'
import { login } from '../reducers/account'

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Accept'] = 'application/json';

export const API_HOST = process.env.NODE_ENV === 'production' ?
  '138.197.104.147:3000' :
  '138.197.104.147:3000'

const instance = axios.create({
  baseURL: `http://${API_HOST}/api`
});

// instance.interceptors.response.use(res => res, async (err) => {
//   if (err.response.status === 401) {
//     const account = JSON.parse(await AsyncStorage.getItem('account') || {})
//     let err = null
//     await AsyncStorage.removeItem('token')
//     return store.dispatch(login())
//   }
//   return Promise.reject(err);
// });

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