import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { DURATION } from 'react-native-easy-toast'

const LOADING = 'ui/LOADING'
const SHOW_TOAST = 'ui/SHOW_TOAST'
const SHOW_MODAL = 'ui/SHOW_MODAL'

export const setLoading = (isLoading, loadText) => ({
    type: LOADING,
    data: { isLoading, loadText }
})

export const showToastAction = (toast, toastProps={}, toastDuration) => ({
    type: SHOW_TOAST,
    data: { toast, toastProps, toastDuration }
})

export const toggleModalAction = (showModal) => ({
    type: SHOW_MODAL,
    data: { showModal }
})

let timeoutId
let currentToast
export const showToast = (toast, toastProps, toastDuration=DURATION.LENGTH_LONG) => (dispatch, getState) => {
    if (currentToast !== toast) {
        clearInterval(timeoutId)
    }
    dispatch(showToastAction(toast, toastProps, toastDuration))
    timeoutId = setInterval(()=>dispatch(showToastAction('', toastProps, 0)), toastDuration)
}

export const toggleModal = () => (dispatch, getState) => {
    const { showModal } = getState().ui
    console.log({showModal})
    dispatch(toggleModalAction(!showModal))
}

const initialState = {
    isLoading : false,
    loadText: '',
    toastDuration: 0,
    showModal: true
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOADING:
        case SHOW_TOAST:
            return {
                ...state,
                ...action.data
            }
        case SHOW_MODAL:
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