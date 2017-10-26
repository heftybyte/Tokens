import {AsyncStorage} from 'react-native';
import TokenTypes from '../types/tokens';
import {createReducer} from './common';

export const actionHandlers = {
    [TokenTypes.FETCH_ALL_TOKENS]: (state, payload) => {return { ...state, tokens: payload }},
};

export const initialState = { tokens : [] };

export default createReducer(initialState, actionHandlers);
