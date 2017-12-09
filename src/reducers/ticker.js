import {
    getHistoricalPrices as getHistoricalPricesApi,
    getPrices as _getPrices
} from '../helpers/api'
import {showToast } from './ui'
import { getError } from '../helpers/functions'

export const UPDATE_PERIOD = 'ticker/UPDATE_PERIOD'
export const LOADING_HISTORICAL_PRICES = 'ticker/LOADING_HISTORICAL_PRICES'
export const LOADING_PRICES = 'ticker/LOADING_PRICES'
export const PRICE_DATA_TYPE = {
    NOW: 'NOW',
    HISTORICAL: 'HISTORICAL'
}

export const priceAction = (prices, format) => ({
    type: PRICE_DATA_TYPE.NOW,
    data: { prices, format }
})

export const historicalPriceAction = (prices, format) => ({
    type: PRICE_DATA_TYPE.HISTORICAL,
    data: { prices, format }
})

export const loadingPricesAction = (format, isLoading, type) => ({
    type: type === 'historical' ? LOADING_HISTORICAL_PRICES : LOADING_PRICES,
    data: { format, isLoading }
})

export const getPrices = ({fsyms,tsyms,format='chart'}) => async(dispatch) => {
    let err = null
    let prices = await _getPrices({fsyms,tsyms,format}).catch(e=>err=e)
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(priceAction(prices, format))
    
}

export const getHistoricalPrices = ({fsyms,tsyms,format='chart',start,end,period,interval}) => async(dispatch, getState) => {
    let err = null

    period = period || getState().ticker.period
    dispatch(loadingPricesAction(format, true, 'historical'))
    let prices = await getHistoricalPricesApi({fsyms,tsyms,start,end,format,period,interval}).catch(e=>err=e)
    if (err) {
        dispatch(loadingPricesAction(format, false, 'historical'))
        dispatch(showToast(getError(err)))
        return
    }
    dispatch(loadingPricesAction(format, false, 'historical'))
    dispatch(historicalPriceAction(prices, format))
}

export const changePeriod = (period) => async(dispatch) => {
    dispatch({
        type: UPDATE_PERIOD,
        data: period
    })
}

const initialState = {
    period: '1m',
    prices: {
        chart: {},
        raw: {},
        loading: {
            chart: false,
            raw: false
        }
    },
    historicalPrices: {
        chart: {},
        raw: {},
        loading: {
            chart: false,
            raw: false
        }
    }
}

export default (state=initialState, action) => {
    switch(action.type) {
        case 'NOW':{
            const { format, prices } = action.data
            return {
                ...state,
                prices: {
                    ...state.prices,
                    [format]: {
                        ...state.prices[format],
                        ...prices
                    }
                }
            }
        }
        case 'HISTORICAL':{
            const { format, prices } = action.data
            return {
                ...state,
                historicalPrices: {
                    ...state.historicalPrices,
                    [format]: {
                        ...state.historicalPrices[format],
                        ...prices
                    }
                }
            }
        }
        case UPDATE_PERIOD:
            return {
                ...state,
                period: action.data
            }
        case LOADING_HISTORICAL_PRICES: {
            const { format, isLoading } = action.data
            return {
                ...state,
                historicalPrices: {
                    ...state.historicalPrices,
                    loading: {
                        ...state.loading,
                        [format]: isLoading
                    }
                }
            }
        }
        default:
            return state
    }
}