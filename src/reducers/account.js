import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {
    loginAccount,
    registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    addAccountAddress,
    deleteAccountAddress,
    getAccount,
    getTokenDetailsForAccount,
		logoutAccount,
		registerUserForPushNotifications
} from '../helpers/api'
import { genericError, getError, registerForPushNotificationsAsync } from '../helpers/functions'

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

export const createAccount = (params) => async (dispatch, getState) => {
    let err = null
    const newAccount = await registerAccount(params).catch(e=>err=e)
    if (err) {
        console.log('createAccount', err)
        return Alert.alert(getError(err))
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
            Alert.alert(getError(err))
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
            Alert.alert(getError(err))
            return
        }
    } else {
        dispatch(NavigationActions.navigate({ routeName: 'Login' }))
        return
    }
    dispatch(loginAction(token, account))
		await registerForPushNotificationsAsync()
    dispatch(getPortfolio())
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const regPushNotification  = async (push_token) => {
	let token = await AsyncStorage.getItem('token')
	setAuthHeader(token)
	await registerUserForPushNotifications({token: push_token})

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
    const account = await addAccountAddress(id, address).catch(e=>err=e)
    if (err) {
        Alert.alert(getError(err))
        return
    }
    dispatch(addAddressAction(account.addresses))
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const deleteAddress = (addressIndex) => async (dispatch, getState) => {
  let err = null
  const { id } = getState().account
  const address = getState().account.addresses[addressIndex]

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
        Alert.alert(getError(err))
        return
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