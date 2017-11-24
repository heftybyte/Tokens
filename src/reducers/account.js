import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { SecureStore } from 'expo'
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
    logoutAccount,
    trackFeedActivity,
	addToAccountWatchlist,
	removeFromAccountWatchlist
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
export const ADD_WATCHLIST = 'account/ADD_WATCHLIST'
export const REMOVE_FROM_WATCHLIST = 'account/REMOVE_FROM_WATCHLIST'
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
    data: { portfolio, stale: false }
})

const updateAction = (account) => ({
    type: UPDATE,
    data: { account }
})

const addWatchListAction = (watchList = []) => ({
	type: ADD_WATCHLIST,
	data: { watchList, stale: true }
})

const removeFromWatchListAction = (watchList = []) => ({
	type: REMOVE_FROM_WATCHLIST,
	data: { watchList, stale: true }
})

const addAddressAction = (addresses=[]) => ({
    type: ADD_ADDRESS,
    data: { addresses, stale: true }
})

const deleteAddressAction = (addresses=[]) => ({
  type: DELETE_ADDRESS,
  data: { addresses, stale: true }
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
    await SecureStore.setItemAsync('id', newAccount.id)
    const pseudonymType = 'username'
    await AsyncStorage.setItem('pseudonym', JSON.stringify({ type: pseudonymType, value: params[pseudonymType] }))
    dispatch(registerAction(newAccount.id))
    dispatch(login(params))
}

export const login = (params) => async (dispatch, getState) => {
    let err = null
    let account = null
    let id = await SecureStore.getItemAsync('id')
    let token = await SecureStore.getItemAsync('token')
    if (params) {
        const res = await loginAccount(params).catch(e=>err=e)
        if (err) {
            dispatch(showToast(getError(err)))
            return
        }
        token = res.id
        account = res.user
        setAuthHeader(token)
        await SecureStore.setItemAsync('token', token)
        await SecureStore.setItemAsync('id', account.id)
    } else if (token && id) {
        setAuthHeader(token)
        account = await getAccount(id).catch(e=>err=e)
        if (err) {
            dispatch(showToast(getError(err)))
            dispatch(NavigationActions.navigate({ routeName: 'Register' }))
            return
        }
    } else {
        dispatch(NavigationActions.navigate({ routeName: 'Register' }))
        return
    }
    dispatch(loginAction(token, account))
    registerForPushNotificationsAsync()
    dispatch(getPortfolio())
    dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
}

export const logout = () => async(dispatch, getState) => {
    let token = await SecureStore.getItemAsync('token')
		let notification_token = await SecureStore.getItemAsync('notification_token')
    if (token && notification_token) {
        setAuthHeader(token)
        await logoutAccount(notification_token)
    }
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('id')
    await AsyncStorage.removeItem('account')
    dispatch(logoutAction())
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Register' })
        ]
    })
    dispatch(resetAction)
}

export const addToWatchlist = (symbol) => async (dispatch, getState) => {
	let err = null
	const { id } = getState().account
	dispatch(setLoading(true, `Adding ${symbol} to Watchlist`))
	const account = await addToAccountWatchlist(id, symbol).catch(e=>err=e)
	dispatch(setLoading(false))
	if (err) {
		dispatch(showToast(getError(err)))
		return
	}
	dispatch(showToast(`${symbol} Added To Watchlist`))
	dispatch(addWatchListAction(account.watchList))
	dispatch(getPortfolio())
}

export const removeFromWatchList = (symbol) => async (dispatch, getState) => {
	const ok = async () => {
		let err = null
		const { id } = getState().account
		dispatch(setLoading(true, `${symbol} From Watchlist`))
		const account = await removeFromAccountWatchlist(id, symbol).catch(e=>err=e)
		dispatch(setLoading(false))
		if (err) {
			dispatch(showToast(getError(err)))
			return
		}
		dispatch(showToast(`${symbol} Removed From Watchlist`))
		dispatch(removeFromWatchListAction(account.watchList))
		dispatch(getPortfolio())
	}

	safeAlert(
		'Are you sure?',
		`Confirm Unwatching of ${symbol}`,
		[
			{text: 'OK', onPress: ok, style: 'destructive'},
			{text: 'Cancel', onPress: ()=>{}, style: 'cancel'},
		],
		{ cancelable: false }
	)
}

export const addAddress = (address) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, 'Saving Address'))
    const account = await addAccountAddress(id, address).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return err
    }
    dispatch(showToast('Address Added'))
    dispatch(addAddressAction(account.addresses))
    dispatch(getPortfolio(true, 'Scanning For Tokens'))
    // dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
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
    dispatch(showToast('Tokens Updated'))
    dispatch(getPortfolio())
    // dispatch(NavigationActions.navigate({ routeName: 'Dashboard' }))
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
        dispatch(getPortfolio())
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

export const getPortfolio = (showUILoader=true, msg) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account

    if (showUILoader) {
        dispatch(setLoading(true, msg || 'Loading Portfolio'))
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
    // removing load screen until freeze issue is resolved
    // dispatch(setLoading(true, `Loading ${sym} Details`))
    const tokenDetails = await getTokenDetailsForAccount(id, sym).catch(e=>err=e)
    // dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(tokenDetailsAction(tokenDetails))
}

const initialState = {
    addresses : [],
		watchList: [],
    id: null,
    token: null,
    portfolio: {
        totalPriceChange: 0,
        totalPriceChangePct: 0,
        totalValue: 0,
        tokens: [],
        top: [],
        watchList: []
    },
    tokenDetails: {
        "marketCap": 0,
        "price": 0,
        "balance": 0,
        "totalValue": 0,
        "volume24Hr": 0,
        "change": 0,
        "priceChange": 0,
    },
    invites: [],
    // Used to know when to fetch updated portfolio
    stale: true,
    watchListMap: {}
}

export const trackFeedItem = (feedItemId, type) => async (dispatch, getState) => {
    const { id } = getState().account;
    trackFeedActivity(feedItemId, id, type);
}

export default (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
        case GET_PORTFOLIO:
        case GET_TOKEN_DETAILS:
        case UPDATE:
        case ADD_ADDRESS:
        case DELETE_ADDRESS:
            return {
                ...state,
                ...action.data
            }
        case LOGIN:
        case ADD_WATCHLIST:
        case REMOVE_FROM_WATCHLIST:
            const watchListMap = {}
            action.data.watchList.forEach((symbol)=>
                watchListMap[symbol] = true
            )
            return {
                ...state,
                ...action.data,
                watchListMap
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