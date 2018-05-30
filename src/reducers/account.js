import { Alert, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Amplitude, Permissions, SecureStore } from 'expo'
import firebase from 'firebase'
import { Linking } from 'react-native'
import {
    loginAccount,
    googleLogin,
    registerAccount as _registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    getAccountPortfolioChart,
    addAccountAddress,
    refreshAccountAddress,
    deleteAccountAddress,
    // wallet
    addAccountWalletAddress,
    deleteAccountWalletAddress,
    addExchangeAccount as addExchangeAccountApi,
    getAccount,
    getTokenDetailsForAccount,
    logoutAccount,
    trackFeedActivity,
    bookMark,
    addToAccountWatchlist,
    removeFromAccountWatchlist,
    logger,
    setCurrency,
    updateProfile as updateProfileApi,
    verifyTwoFactorAuth
} from '../helpers/api'
import {
    genericError,
    getError,
    getErrorMsg,
    registerForPushNotificationsAsync,
    safeAlert,
    removeArrItem,
    get2FA
} from '../helpers/functions'
import { removeWallet } from '../helpers/wallet'
import { getBlockchains } from './blockchains'
import { getExchanges } from './exchanges'
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
export const SAVE_BOOKMARK = 'account/SAVE_BOOKMARK'
export const REMOVE_BOOKMARK = 'account/REMOVE_BOOKMARK'
export const GET_PORTFOLIO_CHART = 'account/GET_PORTFOLIO_CHART'
export const LOADING_CHART = 'account/LOADING_CHART'
export const SET_DEFAULT_CURRENCY = 'account/SET_DEFAULT_CURRENCY'
export const UPDATE_PROFILE = 'account/UPDATE_PROFILE'
// wallet
export const ADD_WALLET_ADDRESS = 'account/WALLET/ADD_ADDRESS'
export const ADD_EXCHANGE_ACCOUNT = 'account/ADD_EXCHANGE_ACCOUNT'

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

const deleteWalletAddressAction = (wallets=[]) => ({
    type: DELETE_ADDRESS,
    data: { wallets, stale: true }
})

const tokenDetailsAction = (tokenDetails) => ({
  type: GET_TOKEN_DETAILS,
  data: { tokenDetails }
})

const portfolioChartAction = (chart) => ({
    type: GET_PORTFOLIO_CHART,
    data: { chart }
})

const saveBookmarkAction = (newsItem) => ({
    type: SAVE_BOOKMARK,
    data: newsItem
})

const removeBookmarkAction = (newsItem) => ({
    type: REMOVE_BOOKMARK,
    data: newsItem
})

const loadingChartAction = (chartLoading) => ({
    type: LOADING_CHART,
    data: { chartLoading }
})

const setCurrencyAction = (currency) => ({
  type: SET_DEFAULT_CURRENCY,
  data: { currency }
})

const updateProfileAction = (profile) => ({
    type: UPDATE_PROFILE,
    data: { profile }
})
// wallet
const addWalletAddressAction = (wallets) => ({
    type: ADD_WALLET_ADDRESS,
    data: {wallets}
})

const addExchangeAccountAction = (exchangeAccounts) => ({
    type: ADD_EXCHANGE_ACCOUNT,
    data: {exchangeAccounts}
})

export const registerAccount = (params) => async (dispatch, getState) => {
    let err = null
    const newAccount = await _registerAccount(params).catch(e=>err=e)
    if (err) {
        console.log('registerAccount', err)
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    await SecureStore.setItemAsync('id', newAccount.id)
    const pseudonymType = 'username'
    await AsyncStorage.setItem('pseudonym', JSON.stringify({ type: pseudonymType, value: params[pseudonymType] }))
    dispatch(registerAction(newAccount.id))
}

async function configureSession(accessToken, userId, account, dispatch) {
    logger.info('user logged in', { userId, accessToken, account: account.username })
    setAuthHeader(accessToken)
    await SecureStore.setItemAsync('token', accessToken)
    await SecureStore.setItemAsync('id', userId)
    Amplitude.setUserId(userId)
    dispatch(loginAction(accessToken, account))
    registerForPushNotificationsAsync()
    dispatch(getPortfolio())
    dispatch(getPortfolioChart())
    dispatch(getBlockchains())
    dispatch(getExchanges())

    logger.info('navigate to profile')
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    }))
}

export const login = (params, options={}) => async (dispatch, getState) => {
    const { suppressToast, failureRedirect=true } = options
    const withGoogle = params && params.withGoogle
    let id = null
    let token = null
    let account = null
    try {
        id = await SecureStore.getItemAsync('id')
        token = await SecureStore.getItemAsync('token')
        const loginFn = withGoogle ? googleLogin : loginAccount
        if (params) {
            dispatch(setLoading(true, 'Authorizing'))
            let res = await loginFn(params)
            // TWO FACTOR
            if (res.twoFactorRequired) {
                dispatch(setLoading(false))
                res = await get2FA(res.userId, dispatch)
            }
            account = res.user
            id = res.user.id
            token = res.id
        } else if (token && id) {
            setAuthHeader(token)
            account = await getAccount(id)
        } else {
            dispatch(NavigationActions.navigate({ routeName: 'Register' }))
            return false
        }
        dispatch(setLoading(false))
        await configureSession(token, id, account, dispatch)
        return true
    } catch(err) {
        dispatch(setLoading(false))
        const error = getError(err)
        logger.error('user login', { id, token, params, error })
        if(error && error.statusCode === 401 && failureRedirect) {
            dispatch(NavigationActions.navigate({ routeName: 'Register' }))
        }
        !suppressToast && dispatch(showToast(getErrorMsg(err)))
        return false
    }
}

export const logout = () => async(dispatch, getState) => {
    let id = await SecureStore.getItemAsync('id')
    logger.info('user logout', { id })
    let token = await SecureStore.getItemAsync('token')
		let notification_token = await SecureStore.getItemAsync('notification_token')
    if (token && notification_token) {
        setAuthHeader(token)
        await logoutAccount(notification_token)
    }
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('id')
    await AsyncStorage.removeItem('account')
    await firebase.auth().signOut()
    dispatch(logoutAction())
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Register' })
        ]
    })
    dispatch(resetAction)
}

export const addToWatchlist = (symbol, token) => async (dispatch, getState) => {
	let err = null
	const { id, portfolio: { watchList } } = getState().account
    const newWatchList = [...watchList, token]
	// dispatch(setLoading(true, `Adding ${symbol} to Watchlist`))
	dispatch(addWatchListAction(newWatchList))
    dispatch(showToast(`${symbol} Added To Watchlist`))

    const account = await addToAccountWatchlist(id, symbol).catch(e=>err=e)
    if (err) {
        const { watchList } = getState().account
        const newWatchList = removeArrItem(watchList, 'symbol', symbol)
        dispatch(showToast(getErrorMsg(err)))
        dispatch(addWatchListAction(newWatchList))
    }
}

export const removeFromWatchList = (symbol, token) => async (dispatch, getState) => {
	const ok = async () => {
		let err = null
		const { id, portfolio: { watchList } } = getState().account
        const newWatchList = removeArrItem(watchList, 'symbol', symbol)
        const removeIndex = watchList.findIndex(item=>item.symbol===symbol)

        if (!newWatchList) {
            dispatch(showToast(`${symbol} is not in your watchlist`))
            return
        }
		dispatch(removeFromWatchListAction(newWatchList))
        dispatch(showToast(`${symbol} Removed From Watchlist`))
        const account = await removeFromAccountWatchlist(id, symbol).catch(e=>err=e)
        if (err) {
            newWatchList.splice(removeIndex, 0, symbol)
            dispatch(showToast(getErrorMsg(err)))
            dispatch(removeFromWatchListAction(newWatchList))
        }
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

export const addAddress = (address, platform, name) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, 'Saving Address'))
    const account = await addAccountAddress(id, address, platform, name).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    dispatch(showToast('Address Added'))
    dispatch(addAddressAction(account.addresses))

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    const pushEnabled = status === 'granted'
    const params = { type: 'ADD_ADDRESS', meta: { pushEnabled } }
    dispatch(NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' }),
        NavigationActions.navigate({ routeName: 'Education', params })
      ]
    }))
}

export const refreshAddress = (address, type) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, `Refreshing Tokens`))
    const account = await refreshAccountAddress(id, address).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    dispatch(showToast('Tokens Updated'))
    dispatch(getPortfolio({accountId: address, type}))
    dispatch(getPortfolioChart({accountId: address, type}))
}

export const deleteAddress = (address) => async (dispatch, getState) => {
    const ok = async () => {
        let err = null
        const { id } = getState().account
        dispatch(setLoading(true, 'Deleting Address'))
        const account = await deleteAccountAddress(id, address).catch(e=>err=e)
        dispatch(setLoading(false))
        if (err) {
            dispatch(showToast(getErrorMsg(err)))
            return
        }
        dispatch(showToast('Address Removed'))
        dispatch(deleteAddressAction(account.addresses))
        dispatch(NavigationActions.navigate({ routeName: 'Home' }))
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

// wallet
export const addWalletAddress = ({address, name, platform}, navParams) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    console.log('id', id)
    dispatch(setLoading(true, 'Saving Wallet'))
    console.log(id, address)
    const account = await addAccountWalletAddress({id, address, name, platform}).catch(e=>err=e)

    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getErrorMsg(err)))
        return err
    }
    dispatch(showToast('Wallet created'))
    dispatch(addWalletAddressAction(account.wallets))
    dispatch(NavigationActions.navigate({ 
        routeName: 'Select Account',
        params: {
            type: 'wallet',
            platform,
            ...navParams
        } 
    }))
}

export const addExchangeAccount = ({ key, secret, name, passphrase, platform }, navParams) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    dispatch(setLoading(true, 'Linking Exchange Account'))
    const account = await addExchangeAccountApi({ id, key, secret, name, passphrase, platform }).catch(e=>err=e)
    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getErrorMsg(err)))
        return err
    }
    dispatch(showToast('Exchange Account Linked'))
    dispatch(addExchangeAccountAction(account.exchangeAccounts))
    dispatch(NavigationActions.navigate({ 
        routeName: 'Select Account',
        params: {
            type: 'exchange_account',
            platform,
            ...navParams
        } 
    }))
}


export const deleteWalletAddress = (address) => async (dispatch, getState) => {
    const ok = async () => {
        let err = null
        const { id } = getState().account
        dispatch(setLoading(true, 'Deleting Wallet'))

        const account = await deleteAccountWalletAddress(id, address).catch(e=>err=e)
        await removeWallet('ethereum', address).catch(e=>err=e)
        dispatch(setLoading(false))
        if (err) {
            dispatch(showToast(getErrorMsg(err)))
            return
        }
        dispatch(showToast('Wallet Removed'))
        dispatch(deleteWalletAddressAction(account.wallets))
        dispatch(getPortfolio())
        dispatch(getPortfolioChart())
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

export const setDefaultCurrency = (currency) => async (dispatch, getState) => {
  let err = null
  const { id } = getState().account
  const account = await setCurrency(id, currency).catch(e=>err=e)

  if (err) {
      dispatch(showToast(getErrorMsg(err)))
      return err
  }
  dispatch(setCurrencyAction(account.preference.currency))
}

export const updateProfile = (profile) => async (dispatch, getState) => {
    try {
        const { id } = getState().account
        dispatch(setLoading(true, 'Updating Account'))
        const account = await updateProfileApi(id, profile)
        console.log('updated', {account})
        dispatch(updateAction(account))
        dispatch(NavigationActions.navigate({ 
            routeName: 'Settings'
        }))
        dispatch(showToast('Profile Updated'))
    } catch (err) {
        console.log('error updating profile', err)
        dispatch(showToast(getErrorMsg(err)))
    }
    dispatch(setLoading(false))
}

export const getPortfolio = ({accountId, type, showUILoader=true, msg}={}) => async (dispatch, getState) => {
    try {
        const { id } = getState().account
        if (showUILoader) {
            dispatch(setLoading(true, msg || accountId ? 'Loading Account' : 'Loading Portfolio'))
        }
        let portfolio = await getAccountPortfolio(id, {accountId,type})
        if (showUILoader) {
            dispatch(setLoading(false))
        }
        dispatch(portfolioAction(portfolio))
    } catch (err) {
        console.log('getPortfolio catch', {err})
        dispatch(setLoading(false))
        dispatch(showToast(getErrorMsg(err)))
    }
}

export const getPortfolioChart = ({accountId, type, period}={}) => async (dispatch, getState) => {
    let err = null
    const { account: { id }, ticker: { period: defaultPeriod } } = getState()
    dispatch(loadingChartAction(true))
    let chart = await getAccountPortfolioChart(id, period || defaultPeriod, {accountId,type}).catch(e=>err=e)
    if (err) {
      logger.error('getPortfolioChart', err)
        dispatch(loadingChartAction(false))
      return
    }
    dispatch(loadingChartAction(false))
    dispatch(portfolioChartAction(chart))
}


export const getTokenDetails = (sym) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    // removing load screen until freeze issue is resolved
    // dispatch(setLoading(true, `Loading ${sym} Details`))
    const tokenDetails = await getTokenDetailsForAccount(id, sym).catch(e=>err=e)
    // dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getErrorMsg(err)))
        return
    }

        dispatch(tokenDetailsAction(tokenDetails))
        return tokenDetails;

}

export const getBookmark = (news) => async (dispatch, getState) => {
    //console.log(news);
    // let err = null
    // const { id } = getState().account
    // const res = await bookMark(id, news).catch(e=>err=e)
    //
    // if (err) {
    //     console.log(err)
    //     return genericError();
    // }
    dispatch(bookmark(news))
}

export const saveBookmark = (news) => async (dispatch, getState) => {
    dispatch(saveBookmarkAction(news))
    dispatch(showToast("Saved to Bookmarks"))
}

export const removeBookmark = (news) => async (dispatch, getState) => {
    const ok = () => {
        dispatch(removeBookmarkAction(news))
        dispatch(showToast("Removed from Bookmarks"))
    }

    safeAlert(
        'Are you sure?',
        `Confirm Removal of Bookmark`,
        [
            {text: 'OK', onPress: ok, style: 'destructive'},
            {text: 'Cancel', onPress: ()=>{}, style: 'cancel'},
        ],
        { cancelable: false }
    )
}

export const updateAccount = (account) => async (dispatch, getState) => {
    dispatch(updateAction(account))
}

const initialState = {
    username: 'escobyte',
    description: '',
    bountyHunter: false,
    two_factor_enabled: false,
    reputation: 0,
    followers: 0,
    following: 0,
    addresses : [],
    wallets: [],
    exchangeAccounts: [],
    watchList: [],
    id: null,
    token: null,
    portfolio: {
        totalPriceChange: 0,
        totalPriceChangePct: 0,
        totalValue: 0,
        tokens: [],
        top: [],
        featured: [],
        watchList: []
    },
    preference: {
      currency: 'USD'
    },
    chartLoading: false,
    portfolioChart: [{x:0,y:0},{x:0,y:0}],
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
    bookmarks: [],
    bookmarkMap: {},
    watchListMap: {}
}

export const trackFeedItem = (feedItemId, type) => async (dispatch, getState) => {
    const { id } = getState().account;
    trackFeedActivity(feedItemId, id, type);
}

export default (state = initialState, action) => {
    switch(action.type) {
        case UPDATE:
            return {
                ...state,
                two_factor_enabled: action.data.account.two_factor_enabled,
                username: action.data.account.username,
                email: action.data.account.email,
                description: action.data.account.description
            }
        case REGISTER:
        case GET_PORTFOLIO:
        case GET_TOKEN_DETAILS:
        case UPDATE:
        case ADD_ADDRESS:
        case DELETE_ADDRESS:
        case LOADING_CHART:
        case ADD_WALLET_ADDRESS:
        case ADD_EXCHANGE_ACCOUNT:
            return {
                ...state,
                ...action.data
            }
        case SET_DEFAULT_CURRENCY:
            return {
              ...state,
              preference: {
                ...action.data
              }
            }
        case LOGIN:{
            const watchListMap = {}
            action.data.watchList.forEach((symbol)=>
                watchListMap[symbol] = true
            )
            return {
                ...state,
                ...action.data,
                watchListMap
            }
        }
        case ADD_WATCHLIST:
        case REMOVE_FROM_WATCHLIST:{
            const watchListMap = {}
            action.data.watchList.forEach((token)=>
                watchListMap[token.symbol] = true
            )
            return {
                ...state,
                watchList: action.data.watchList.map(item=>item.symbol),
                portfolio: {
                    ...state.portfolio,
                    watchList: action.data.watchList
                },
                watchListMap
            }
        }
        case LOGOUT:
            return {
                ...initialState
            }
        case SAVE_BOOKMARK:
            const bookmarkMap = {[action.data.id]: true}
            state.bookmarks.forEach((bookmark)=>
                bookmarkMap[bookmark.id] = true
            )
            return {
                ...state,
                bookmarks: [...state.bookmarks, action.data],
                bookmarkMap
            }
        case REMOVE_BOOKMARK: {
            const bookmarks = []
            const bookmarkMap = {}
            state.bookmarks.forEach((bookmark)=>{
                if (bookmark.id !== action.data.id) {
                    bookmarks.push(bookmark)
                    bookmarkMap[bookmark.id] = true
                }
            })
            return {
                ...state,
                bookmarks,
                bookmarkMap
            }
        }
        case GET_PORTFOLIO_CHART:
            return {
                ...state,
                portfolioChart: [...action.data.chart]
            }
        default:
            return {
                ...state
            }
    }
}
