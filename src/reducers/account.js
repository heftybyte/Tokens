import { Alert, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Amplitude, Permissions, SecureStore } from 'expo'
import { Linking } from 'react-native'
import {
    loginAccount,
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
    getAccount,
    getTokenDetailsForAccount,
    logoutAccount,
    trackFeedActivity,
    bookMark,
    addToAccountWatchlist,
    removeFromAccountWatchlist,
    logger
} from '../helpers/api'
import {
    genericError,
    getError,
    registerForPushNotificationsAsync,
    safeAlert,
    removeArrItem
} from '../helpers/functions'
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
// wallet
export const ADD_WALLET_ADDRESS = 'account/WALLET/ADD_ADDRESS'

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

// wallet
const addWalletAddressAction = (wallets) => ({
    type: ADD_WALLET_ADDRESS,
    data: {wallets}
})

export const registerAccount = (params) => async (dispatch, getState) => {
    let err = null
    const newAccount = await _registerAccount(params).catch(e=>err=e)
    if (err) {
        console.log('registerAccount', err)
        dispatch(showToast(getError(err)))
        return
    }
    await SecureStore.setItemAsync('id', newAccount.id)
    const pseudonymType = 'username'
    await AsyncStorage.setItem('pseudonym', JSON.stringify({ type: pseudonymType, value: params[pseudonymType] }))
    dispatch(registerAction(newAccount.id))
}

export const login = (params) => async (dispatch, getState) => {
    let err = null
    let account = null
    let id = await SecureStore.getItemAsync('id')
    let token = await SecureStore.getItemAsync('token')
    logger.debug('login', {id,token})
    if (params) {
        const res = await loginAccount(params).catch(e=>err=e)
        if (err) {
            const { error } = err.response.data;
            if(error && error.statusCode === 401) {
                error.message = 'Incorrect email or password';
            }
            dispatch(showToast(getError(err)))
            return
        }
        token = res.id
        account = res.user
        logger.info('user login via params', { id })
        setAuthHeader(token)
        await SecureStore.setItemAsync('token', token)
        await SecureStore.setItemAsync('id', account.id)
    } else if (token && id) {
        console.log('login info log')
        logger.info('user login via SecureStore', { id })
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
    Amplitude.setUserId(account.id)
    dispatch(loginAction(token, account))
    registerForPushNotificationsAsync()
    dispatch(getPortfolio())
    dispatch(getPortfolioChart())
    dispatch(getBlockchains())
    dispatch(getExchanges())

    // const url = Linking.getInitialURL().catch(e=>err=e)
    // if (err) {
    //     logger.error('Linking.getInitialURL', err)
    // } else {
    //     visitDeepLink(url)
    //     return
    // }
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Profile' })
      ]
    }))
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
        dispatch(showToast(getError(err)))
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
            dispatch(showToast(getError(err)))
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

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    const pushEnabled = status === 'granted'
    const params = { type: 'ADD_ADDRESS', meta: { pushEnabled } }
    dispatch(NavigationActions.navigate({ routeName: 'Education', params }))
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
    dispatch(getPortfolioChart())
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

// wallet
export const addWalletAddress = (address, platform) => async (dispatch, getState) => {
    let err = null
    const { id } = getState().account
    console.log('id', id)
    dispatch(setLoading(true, 'Creating Wallet'))
    console.log(id, address)
    const account = await addAccountWalletAddress(id, address, platform).catch(e=>err=e)

    dispatch(setLoading(false))
    if (err) {
        dispatch(showToast(getError(err)))
        return err
    }
    dispatch(showToast('Wallet created'))
    dispatch(addWalletAddressAction(account.wallets))

    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    const pushEnabled = status === 'granted'
    const params = { type: 'ADD_WALLET_ADDRESS', meta: { pushEnabled } }
    dispatch(NavigationActions.navigate({ routeName: 'Select Account', params: { type: 'wallet', platform} }))
}


export const deleteWalletAddress = (address) => async (dispatch, getState) => {
    const ok = async () => {
        let err = null
        const { id } = getState().account
        dispatch(setLoading(true, 'Deleting Wallet Address'))

        const account = await deleteAccountWalletAddress(id, address).catch(e=>err=e)

        dispatch(setLoading(false))
        if (err) {
            dispatch(showToast(getError(err)))
            return
        }
        dispatch(showToast('Wallet Address Removed'))
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

export const getPortfolioChart = (_period) => async (dispatch, getState) => {
    let err = null
    const { account: { id }, ticker: { period } } = getState()
    dispatch(loadingChartAction(true))
    let chart = await getAccountPortfolioChart(id, _period || period).catch(e=>err=e)
    if (err) {
      logger.err('getPortfolioChart', err)
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
        dispatch(showToast(getError(err)))
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

const initialState = {
    username: 'escobyte',
    reputation: 20,
    followers: 200,
    following: 5,
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
        watchList: []
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
        case REGISTER:
        case GET_PORTFOLIO:
        case GET_TOKEN_DETAILS:
        case UPDATE:
        case ADD_ADDRESS:
        case DELETE_ADDRESS:
        case LOADING_CHART:
        case ADD_WALLET_ADDRESS:
            return {
                ...state,
                ...action.data
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