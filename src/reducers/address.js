import types from './reducerTypes';

export const actions = {
    [types.ADD_ADDRESS]: (state, payload) => {return { ...state, addresses: [ ...state.addresses, payload.address ]}},
    [types.REMOVE_ADDRESS]: (state, payload) => {return { ...state, addresses: state.addresses.filter((address, index) => index !== payload.index)}},
    [types.GET_ADDRESSES]: (state, payload) => {return { ...state, addresses: [ ...payload.addresses ]}},
    [types.MODIFY_ADDRESSES_FAILED]: (state, payload) => {return { ...state, errors: { addresses: payload.error }}}
};

export const reduce = (state,reduceFn, payload) => reduceFn ? reduceFn(state, payload) : state;

export const initialState = { addresses : [] };

export default (state = initialState, action) => reduce(state, actions[action.type], action.payload);