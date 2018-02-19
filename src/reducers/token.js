import throttleAction from 'throttle-action';

const UPDATE = 'token/UPDATE'

export const updateAction = (data) => ({
    type: UPDATE,
    data
})

const _update = (data) => (dispatch) => {
    dispatch(updateAction(data))
}

export const update = throttleAction(_update, 500, { trailing: false })

const initialState = {
    timestamp: 0,
    price: 0,
    change_pct: 0,
    change_close: 0
}

export default (state = initialState, action) => {
    switch(action.type) {
        case UPDATE:
            return {
                ...state,
                ...action.data
            }
        default:
            return {
                ...state
            }
    }
}