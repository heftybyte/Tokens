import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { DURATION } from 'react-native-easy-toast'

const LOADING = 'ui/LOADING'
const SHOW_TOAST = 'ui/SHOW_TOAST'

export const setLoading = (isLoading, loadText) => ({
    type: LOADING,
    data: { isLoading, loadText }
})

export const showToastAction = (toast, toastDuration, toastProps={}) => ({
    type: SHOW_TOAST,
    data: { toast, toastDuration, toastProps }
})

let timeoutId
let currentToast
export const showToast = (toast, toastProps, toastDuration=DURATION.LENGTH_LONG) => (dispatch, getState) => {
    if (currentToast !== toast) {
        clearInterval(timeoutId)
    }
    dispatch(showToastAction(toast, toastDuration, toastProps))
    timeoutId = setInterval(()=>dispatch(showToastAction('', 0, toastProps)), toastDuration)
}

const initialState = {
    isLoading : false,
    loadText: '',
    toastDuration: 0
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