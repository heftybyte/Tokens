export const actions = {
    'INCREMENT_COUNTER': (state) => { return  { ...state, count: state.count + 1} }
};

export const reduce = (state,reduceFn) => reduceFn ? reduceFn(state) : state;

export const initialState = { count : 0 };

export default (state = initialState, action) => reduce(state, actions[action.type]);