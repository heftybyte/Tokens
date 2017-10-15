import axios from 'axios';
import Expo from 'expo';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const baseURL = process.env.NODE_ENV === 'production' ?
  'https://erc-20.io' :
  'http://192.168.86.22:3000/api'

const instance = axios.create({
  baseURL
});

export const setAuthHeader = (token) => {
  instance.defaults.headers.common['Authorization'] = token
}

export const registerAccount = async () => {
  let res = await instance.post(`/accounts/register`)
  return res.data
}

export const loginAccount = async (id) => {
  let res = await instance.post(`/accounts/login`, { id })
  return res.data
}

export const addAccountAddress = async (id, address) => {
  let res = await instance.post(`/accounts/${id}/address`, { address })
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