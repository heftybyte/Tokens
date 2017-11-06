import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {
    loginAccount,
    registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    addAccountAddress,
    refreshAccountAddress,
    deleteAccountAddress,
    getAccount,
    getTokenDetailsForAccount,
        logoutAccount
} from '../helpers/api'
import { safeAlert } from '../helpers/functions'
import {
    genericError,
    getError,
    registerForPushNotificationsAsync
} from '../helpers/functions'
import { setLoading, showToast } from './ui'

export const REGISTER = 'account/REGISTER'
export const LOGIN = 'account/LOGIN'
export const LOGOUT = 'account/LOGOUT'
export const GET_PORTFOLIO = 'account/GET_PORTFOLIO'
export const UPDATE = 'account/UPDATE'
export const ADD_ADDRESS = 'account/ADD_ADDRESS'
export const DELETE_ADDRESS = 'account/DELETE_ADDRESS'
export const GET_TOKEN_DETAILS = 'account/GET_TOKEN_DETAILS'
export const REFRESH_ADDRESS = 'account/REFRESH_ADDRESS'

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

export const createAccount = (params) => async (dispatch, getState) => {
    let err = null
    const newAccount = await registerAccount(params).catch(e=>err=e)
    if (err) {
        console.log('createAccount', err)
        dispatch(showToast(getError(err)))
        return
    }
    await AsyncStorage.setItem('id', newAccount.id)
    const pseudonymType = params.email ? 'email' : 'username'
    await AsyncStorage.setItem('pseudonym', JSON.stringify({ type: pseudonymType, value: params[pseudonymType] }))
    dispatch(registerAction(newAccount.id))
    dispatch(login(params))
}

export const login = (params) => async (dispatch, getState) => {
    let err = null
    let account = null
    let id = await AsyncStorage.getItem('id')
    let token = await AsyncStorage.getItem('token')
    if (params) {
        const res = await loginAccount(params).catch(e=>err=e)
        if (err) {
            dispatch(showToast(getError(err)))
            return
        }
        token = res.id
        account = res.user
        setAuthHeader(token)
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('id', account.id)
    } else if (token && id) {
        setAuthHeader(token)
        account = await getAccount(id).catch(e=>err=e)
        if (err) {
            dispatch(showToast(getError(err)))
            dispatch(NavigationActions.navigate({ routeName: 'Login' }))
            return
        }
    } else {
        dispatch(NavigationActions.navigate({ routeName: 'Login' }))
        return
    }
    dispatch(loginAction(token, account))
    registerForPushNotificationsAsync()
    dispatch(getPortfolio())
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const logout = () => async(dispatch, getState) => {
    let token = await AsyncStorage.getItem('token')
    if (token) {
        setAuthHeader(token)
        await logoutAccount()
    }
    await AsyncStorage.multiRemove(['token', 'id', 'account'])
    dispatch(logoutAction())
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Register' })
        ]
    })
    dispatch(resetAction)
}

export const addAddress = (address) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, 'Saving Address'))
    const account = await addAccountAddress(id, address).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(addAddressAction(account.addresses))
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const refreshAddress = (address) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, `Refreshing Tokens`))
    const account = await refreshAccountAddress(id, address).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(getPortfolio())
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const deleteAddress = (address) => async (dispatch, getState) => {
    const ok = async () => {
        let err = null
        const { id } = getState().account
        dispatch(setLoading(true, 'Deleting Address'))
        const account = await deleteAccountAddress(id, address).catch(e=>err=e)
        dispatch(setLoading(false))
        if (err) {
            dispatch(showToast(getError(err)))
            return
        }
        dispatch(showToast('Address Removed'))
        dispatch(deleteAddressAction(account.addresses))
    }

    safeAlert(
      'Are you sure?',
      `Confirm deletion of ${address}`,
      [
        {text: 'OK', onPress: ok, style: 'destructive'},
        {text: 'Cancel', onPress: ()=>{}, style: 'cancel'},
      ],
      { cancelable: false }
    )

}

export const getPortfolio = (showUILoader=true) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account

    if (showUILoader) {
        dispatch(setLoading(true, 'Loading Portfolio'))
    }
    let portfolio = await getAccountPortfolio(id).catch(e=>err=e)
    if (showUILoader) {
        dispatch(setLoading(false))
    }

    if (err) {
      dispatch(showToast(getError(err)))
      return
    }
    dispatch(portfolioAction(portfolio))
}

export const getTokenDetails = (sym) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account

    dispatch(setLoading(true, `Loading ${sym} details`))
    const tokenDetails = await getTokenDetailsForAccount(id, sym).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(tokenDetailsAction(tokenDetails))
}

const initialState = {
    addresses : [],
    id: null,
    token: null,
    portfolio: {},
    tokenDetails: {},
    invites: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
        case LOGIN:
        case GET_PORTFOLIO:
        case GET_TOKEN_DETAILS:
        case UPDATE:
        case ADD_ADDRESS:
        case DELETE_ADDRESS:
            return {
                ...state,
                ...action.data
            }
        case LOGOUT:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}