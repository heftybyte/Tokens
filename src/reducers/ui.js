import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { DURATION } from 'react-native-easy-toast'

const LOADING = 'ui/LOADING'
const SHOW_TOAST = 'ui/SHOW_TOAST'
let timeoutId

export const setLoading = (isLoading, loadText) => ({
    type: LOADING,
    data: { isLoading, loadText }
})

export const showToastAction = (toast) => ({
    type: SHOW_TOAST,
    data: { toast }
})

export const showToast = (toast) => (dispatch, getState) => {
    clearInterval(timeoutId)
    dispatch(showToastAction(toast))
    timeoutId = setInterval(()=>dispatch(showToastAction('')), DURATION.LENGTH_LONG)
}

const initialState = {
    isLoading : false,
    loadText: ''
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOADING:
        case SHOW_TOAST:
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