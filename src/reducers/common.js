export const reduce = (state, reduceFn, payload) => reduceFn ? reduceFn(state, payload) : state;

export const createReducer = (intialState = {}, actionHandlers = {}) => (state = intialState, { type, payload }) => reduce(state, actionHandlers[type] || actionHandlers.default, payload);