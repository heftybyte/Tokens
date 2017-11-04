import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'

const LOADING = 'ui/LOADING'

export const setLoading = (isLoading, loadText) => ({
    type: LOADING,
    data: { isLoading, loadText }
})

const initialState = {
    isLoading : false,
    loadText: ''
}

export default (state = initialState, action) => {
    switch(action.type) {
        case LOADING:
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