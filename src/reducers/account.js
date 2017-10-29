import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {
    loginAccount,
    registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    addAccountAddress,
    deleteAccountAddress,
    getAccount,
    getTokenDetailsForAccount
} from '../helpers/api'
import { genericError } from '../helpers/functions'

export const REGISTER = 'account/REGISTER'
export const LOGIN = 'account/LOGIN'
export const LOGOUT = 'account/LOGOUT'
export const GET_PORTFOLIO = 'account/GET_PORTFOLIO'
export const UPDATE = 'account/UPDATE'
export const ADD_ADDRESS = 'account/ADD_ADDRESS'
export const DELETE_ADDRESS = 'account/DELETE_ADDRESS'
export const GET_TOKEN_DETAILS = 'account/GET_TOKEN_DETAILS'

const registerAction = (id) => ({
    type: REGISTER,
    data: { id }
})

const loginAction = (token, account) => ({
    type: LOGIN,
    data: { ...account, token }
})

const logoutAction = () => ({
    type: LOGOUT
})

const portfolioAction = (portfolio) => ({
    type: GET_PORTFOLIO,
    data: { portfolio }
})

const updateAction = (account) => ({
    type: UPDATE,
    data: { account }
})

const addAddressAction = (addresses=[]) => ({
    type: ADD_ADDRESS,
    data: { addresses }
})

const deleteAddressAction = (addresses=[]) => ({
  type: DELETE_ADDRESS,
  data: { addresses }
})

const tokenDetailsAction = (tokenDetails) => ({
  type: GET_TOKEN_DETAILS,
  data: { tokenDetails }
})

export const register = (type, params) => async (dispatch) => {
    let err = null
    const account = JSON.parse(await AsyncStorage.getItem('account') || null) ||
        await registerAccount(type, params).catch(e=>err=e)

    if (err || !account) {
        console.log(err)
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
            console.log(err)
            return genericError()
        }
        token = res.id
    }
    setAuthHeader(token)

    const account = await getAccount(id).catch(e=>err=e)
    if (err) {
        console.log(err)
        return genericError()
    }
    await AsyncStorage.setItem('account', JSON.stringify(account))
    await AsyncStorage.setItem('token', token)
    dispatch(loginAction(token, account))
}

export const logout = () => async(dispatch, getState) => {
    await AsyncStorage.multiRemove(['token', 'id', 'account'])
    dispatch(logoutAction())
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const addAddress = (address) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    const account = await addAccountAddress(id, address).catch(e=>err=e)
    if (err) {
        console.log(err)
        return genericError()
    }
    console.log('account.addresses', account.addresses)
    dispatch(addAddressAction(account.addresses))
}

export const deleteAddress = (addressIndex) => async (dispatch, getState) => {
  let err = null
  const { id } = getState().account
  const address = JSON.parse(getState().account.addresses[addressIndex])

  const account = await deleteAccountAddress(id, address).catch(e=>err=e)
  if (err) {
      console.log(err)
      return genericError()
  }

  dispatch(deleteAddressAction(account.addresses))
}

export const getPortfolio = () => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    const portfolio = await getAccountPortfolio(id).catch(e=>err=e)
    if (err) {
        console.log(err)
        return genericError()
    }

    dispatch(portfolioAction(portfolio))
}

export const getTokenDetails = (sym) => async (dispatch, getState) => {
  let err = null
  const { id } = getState().account
  const tokenDetails = await getTokenDetailsForAccount(id, sym).catch(e=>err=e)

  if (err) {
    console.log(err)
    return genericError();
  }

  dispatch(tokenDetailsAction(tokenDetails))
}

const initialState = {
    addresses : [],
    id: null,
    token: null,
    portfolio: {},
    tokenDetails: {}
}

export default (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
        case LOGIN:
        case GET_PORTFOLIO:
        case GET_TOKEN_DETAILS:
        case UPDATE:
            return {
                ...state,
                ...action.data
            }
        case LOGOUT:
            return {
                ...initialState
            }
        case ADD_ADDRESS:
        case DELETE_ADDRESS:
            return {
                ...state,
                addresses: [...action.data.addresses]
            }
        default:
            return {
                ...state
            }
    }
}