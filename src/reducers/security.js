import types from '../types/security';
import {createReducer} from './common';

const initialState = {
    hasPinEnabled: false,
    hasFingerprintEnabled: false
}

export const actionHandlers = {
    [types.ENABLE_FINGERPRINT]: (state) => {return { ...state, hasFingerprintEnabled: true}},
    [types.ENABLE_PIN]: (state) => {return { ...state, hasPinEnabled: true}},
    [types.DISABLE_FINGERPRINT]: (state) => {return { ...state, hasFingerprintEnabled: false}},
    [types.DISABLE_PIN]: (state) => {return { ...state, hasPinEnabled: false}},
};

export default createReducer(initialState, actionHandlers);