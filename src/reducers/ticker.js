import {getPricedata} from '../helpers/api'
import {showToast } from './ui'
import { getError } from '../helpers/functions'




export const PRICE_DATA_TYPE = {
    NOW: 'NOW',
    HISTORICAL: 'HISTORICAL'
}

export const GET_PRICE_DATA = (data) => ({
    type: PRICE_DATA_TYPE.NOW,
    data: data
})

export const GET_HISTORICAL_PRICE_DATA = (data) => ({
    type: PRICE_DATA_TYPE.HISTORICAL,
    data: data
})

export const getChartData = () => async(dispatch) => {
    let err = null
    let res = await getPricedata().catch(e=>err=e)
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(PRICE_DATA())
    
}

export const getHistoricalChartData = () => async(dispatch) => {
    let err = null
    let res = await getHistoricalPricedata().catch(e=>err=e)
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(PRICE_DATA())
    
}

const initialState = {
    prices: [],
    historical_prices: []
}

export default (state=initialState, action) => {
    switch(action.type) {
        case 'NOW':
        return {
            ...state,
            prices: action.data, ...state.prices
        }
        case 'HISTORICAL':
        return {
            ...state,
            historical_prices: action.data, ...historical_prices.prices
        }
        default:
        return state
    }
}