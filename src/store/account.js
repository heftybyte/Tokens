import { AsyncStorage } from 'react-native'
import {
    loginAccount,
    registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    addAccountAddress,
    getAccount
} from '../helpers/api'
import { genericError } from '../helpers/functions'

export const REGISTER = 'account/REGISTER'
export const LOGIN = 'account/LOGIN'
export const GET_PORTFOLIO = 'account/GET_PORTFOLIO'
export const UPDATE = 'account/UPDATE'

const registerAction = (id) => ({
    type: REGISTER,
    data: { id }
})

const loginAction = (token, account) => ({
    type: LOGIN,
    data: { ...account, token }
})

const portfolioAction = (portfolio) => ({
    type: GET_PORTFOLIO,
    data: { portfolio }
})

const updateAction = (account) => ({
    type: UPDATE,
    data: { account }
})

export const register = () => async (dispatch) => {
    let err = null
    const account = JSON.parse(await AsyncStorage.getItem('account') || null) || 
        await registerAccount().catch(e=>err=e)

    if (err || !account) {
        return genericError()
    }
    await AsyncStorage.setItem('account', JSON.stringify(account))
    dispatch(registerAction(account.id))
}

export const login = () => async (dispatch, getState) => {
    const { id } = getState().account
    let err = null
    let token = await AsyncStorage.getItem('token')

    if (!token) {
        const res = await loginAccount(id).catch(e=>err=e)
        if (err) {
            return genericError()
        }
        token = res.id
    }
    setAuthHeader(token)
    
    const account = await getAccount(id).catch(e=>err=e)
    if (err) {
        return genericError()
    }
    await AsyncStorage.setItem('account', JSON.stringify(account))
    await AsyncStorage.setItem('token', token)
    dispatch(loginAction(token, account))
}

export const addAddress = (address) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    const account = await addAccountAddress(id, address).catch(e=>err=e)
    if (err) {
        return genericError()
    }

    dispatch(updateAction(account))
}

export const deleteAddress = (address) => async (dispatch, getState) => {
   return;
}

export const getPortfolio = () => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    const portfolio = await getAccountPortfolio(id).catch(e=>err=e)
    if (err) {
        return genericError()
    }

    dispatch(portfolioAction(portfolio))
}

const initialState = {
    addresses : [],
    id: null,
    token: null,
    portfolio: {}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
        case LOGIN:
        case GET_PORTFOLIO:
        case UPDATE:
            return {
                ...state,
                ...action.data
            }
        default:
            return {
                ...state
            }
    }
}