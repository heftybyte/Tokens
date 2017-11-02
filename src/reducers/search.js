import {AsyncStorage} from 'react-native';
import TokenTypes from '../types/tokens';
import {createReducer} from './common';

export const actionHandlers = {
    [TokenTypes.FETCH_ALL_TOKENS]: (state, {tokens, checksum}) => {return { ...state, tokens, checksum }},
    [TokenTypes.FETCHED_FROM_STORAGE]: (state) => {return { ...state, fetchedFromStorage: true }}
};

export const initialState = { tokens : [], fetchedFromStorage: false, checksum: null };

export default createReducer(initialState, actionHandlers);
