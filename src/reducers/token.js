const UPDATE = 'token/UPDATE'

export const updateAction = (data) => ({
    type: UPDATE,
    data
})

export const update = (data) => (dispatch) => {
    dispatch(updateAction(data))
}

const initialState = {
    timestamp: 0,
    price: 0
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