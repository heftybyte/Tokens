import types from './reducerTypes';
import {createReducer} from './common';

export const actionHandlers = {
    [types.ADD_ADDRESS]: (state, payload) => {return { ...state, addresses: [ ...state.addresses, payload.address ]}},
    [types.REMOVE_ADDRESS]: (state, payload) => {return { ...state, addresses: state.addresses.filter((address, index) => index !== payload.index)}},
    [types.GET_ADDRESSES]: (state, payload) => {return { ...state, addresses: [ ...payload.addresses ]}},
    [types.MODIFY_ADDRESSES_FAILED]: (state, payload) => {return { ...state, errors: { addresses: payload.error }}}
};

export const initialState = { addresses : [] };

export default createReducer(initialState, actionHandlers);