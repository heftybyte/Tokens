import types from '../types/security';
import {createReducer} from './common';
import { setTwoFactorAuthSecret as setTwoFactorAuthSecretApi, verifyTwoFactorAuth } from '../helpers/api'
import { NavigationActions } from 'react-navigation'
import {
    genericError,
    getError,
    registerForPushNotificationsAsync,
    safeAlert,
    removeArrItem
} from '../helpers/functions'
import { setTwoFactorAuthSecretAction, disableTwoFactoAuthAction, disablePin, disableFingerprint } from '../actions/security';
import { setLoading, showToast } from './ui'

const initialState = {
    hasPinEnabled: false,
    hasFingerprintEnabled: false,
    hasTwoFactorAuthEnabled: false,
}

export const setTwoFactorAuthSecret = () => async (dispatch, getState) => {
    let err = null;
	const { id } = getState().account
	dispatch(setLoading(true, 'Generating Two-Factor Auth Key'))
	const response = await setTwoFactorAuthSecretApi(id).catch(e=>err=e);
	if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getError(err)))
        return
	}
	const secretKey = response.two_factor_secret
	dispatch(setLoading(false))
    dispatch(NavigationActions.navigate({ routeName: 'Confirm 2FA', params: {secretKey} }))
}

export const verifyTwoFactorAuthToken = ({token, confirm, login}) => async (dispatch, getState) => {
    let err = null;
	const {id} = getState().account
    dispatch(setLoading(true, 'Verifying two factor token'))
	const response = await verifyTwoFactorAuth(id, {token, confirm, login}).catch(e=>err=e);
	if(err){
        dispatch(setLoading(false))
        dispatch(showToast(getError(err)))
        return
	}
    dispatch(setLoading(false))    
    if(!response){
        dispatch(showToast('Token verification failed. Please try again'))
        return
    }
    if (confirm) {
        dispatch(disableFingerprint());
        dispatch(disablePin());
    }
    dispatch(showToast('Token successfully verified'))
    dispatch(NavigationActions.navigate({ routeName: 'Settings', params: {} }))
}

export const actionHandlers = {
    [types.ENABLE_FINGERPRINT]: (state) => {return { ...state, hasFingerprintEnabled: true}},
    [types.ENABLE_PIN]: (state) => {return { ...state, hasPinEnabled: true}},
    [types.DISABLE_FINGERPRINT]: (state) => {return { ...state, hasFingerprintEnabled: false}},
    [types.DISABLE_PIN]: (state) => {return { ...state, hasPinEnabled: false}},
    [types.DISABLE_TWO_FACTOR_AUTH]: (state) => {return { ...state, hasTwoFactorAuthEnabled: false}},
    [types.ENABLE_TWO_FACTOR_AUTH]: (state) => { return { ...state, hasTwoFactorAuthEnabled: true}},
};

export default createReducer(initialState, actionHandlers);