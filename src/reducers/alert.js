import { setLoading, showToast } from './ui'
import { NavigationActions } from 'react-navigation'
import types from '../types/alert';
import {createReducer} from './common';

import {
    genericError,
    getErrorMsg,
    registerForPushNotificationsAsync,
    safeAlert,
    removeArrItem
} from '../helpers/functions'
import {
    getPriceAlert as getPriceAlertApi,
    setPriceAlert as setPriceAlertApi,
    enablePriceAlert as enablePriceAlertApi,
    disablePriceAlert as disablePriceAlertApi,
    deletePriceAlert as deletePriceAlertApi,
    setAuthHeader,
} from '../helpers/api'
import { SecureStore } from 'expo'
import { fetchPriceAlertAction, disablePriceAlertAction, enablePriceAlertAction, deletePriceAlertAction } from '../actions/alert';

const initialState = {
    alerts: []
}

export const getPriceAlert = () => async(dispatch, getState) => {
    let err = null

    dispatch(setLoading(true, 'Fetching Price Alert'))
    let token = await SecureStore.getItemAsync('token')
    setAuthHeader('GnR32xxVUfaFX0GDYDG9mLYO1ARwncGPuHJRrLge9YSnWZsaDiaFyPCWGkmSxyPx')
    const result = await getPriceAlertApi().catch(e=>err=e)
    if(err){
        dispatch(showToast(getErrorMsg(err)))
        return
    }

    dispatch(fetchPriceAlertAction(result))
    dispatch(setLoading(false))
    dispatch(showToast('SuccessFul'))
}

export const createPriceAlert = (data) => async(dispatch, getState)=> {
    let err = null
    dispatch(setLoading(true, 'Creating Price Alert'))
    let token = await SecureStore.getItemAsync('token')
    // setAuthHeader(token)
    setAuthHeader('GnR32xxVUfaFX0GDYDG9mLYO1ARwncGPuHJRrLge9YSnWZsaDiaFyPCWGkmSxyPx')
    const setResult = await setPriceAlertApi(data).catch(e=>err=e)
    if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    const result = await getPriceAlertApi().catch(e=>err=e)
    if(err){
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    
    dispatch(fetchPriceAlertAction(result))
    dispatch(setLoading(false))
    dispatch(showToast('Price Alert Created Successfully'))
    dispatch(NavigationActions.back())
}

export const enablePriceAlert = (alertId) => async(dispatch, getState) => {
    let err = null

    let alerts = getState().alert;
    const index = alerts.findIndex((item)=>item.id === alertId)
    alerts[index].status = true

    dispatch(setLoading(true, 'Enabling Price Alert'))
    let token = await SecureStore.getItemAsync('token')
    setAuthHeader('GnR32xxVUfaFX0GDYDG9mLYO1ARwncGPuHJRrLge9YSnWZsaDiaFyPCWGkmSxyPx')

    const result = await enablePriceAlertApi(alertId).catch(e=>err=e)
    if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    dispatch(setLoading(false))
    dispatch(enablePriceAlertAction(alerts))
}

export const disablePriceAlert = (alertId) => async(dispatch, getState) => {
    let err = null

    dispatch(setLoading(true, 'Disabling Price Alert'))

    let alerts = getState().alert;
    const index = alerts.findIndex((item)=>item.id === alertId)
    alerts[index].status = false

    let token = await SecureStore.getItemAsync('token')
    setAuthHeader('GnR32xxVUfaFX0GDYDG9mLYO1ARwncGPuHJRrLge9YSnWZsaDiaFyPCWGkmSxyPx')

    const result = await disablePriceAlertApi(alertId).catch(e=>err=e)
    if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    dispatch(setLoading(false))
    dispatch(disablePriceAlertAction(alerts))
}

export const deletePriceAlert = (alertId) => async(dispatch, getState) => {
    let err = null

    dispatch(setLoading(true, 'Deleting Price Alert'))

    let alerts = getState().alert;
    const index = alerts.findIndex((item)=>item.id === alertId)
    alerts = alerts.splice(index, 1)

    let token = await SecureStore.getItemAsync('token')
    setAuthHeader('GnR32xxVUfaFX0GDYDG9mLYO1ARwncGPuHJRrLge9YSnWZsaDiaFyPCWGkmSxyPx')

    const result = await deletePriceAlertApi(alertId).catch(e=>err=e)
    if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getErrorMsg(err)))
        return
    }
    dispatch(setLoading(false))
    dispatch(deletePriceAlertAction(alerts))

}

export const actionHandlers = {
    [types.FETCH_PRICE_ALERT]: (state, data) => { return [ ...data ] },
    [types.ENABLE_PRICE_ALERT]: (state, data) => {return [...data ] },
    [types.DISABLE_PRICE_ALERT]: (state, data) => { return [...data]},
    [types.DELETE_PRICE_ALERT]: (state, data) => { return [...data]},
};

export default createReducer(initialState, actionHandlers);
