import { getExchanges as _getExchanges } from '../helpers/api'
import { getExchangeImage } from '../helpers/functions'
import {showToast } from './ui'
import {
    getErrorMsg,
} from '../helpers/functions'

export const types = {
    GET_EXCHANGES: 'GET_EXCHANGES',
}

export const getExchangesAction = (data) => ({
    type: types.GET_EXCHANGES,
    payload: data
});

export const getExchanges = () => async (dispatch) => {
    try {
        const exchanges = await _getExchanges()
        const exchangeItems = exchanges.map(e=>({
            ...e,
            image: getExchangeImage(e.name)
        }))
        dispatch(getExchangesAction(exchangeItems));
    } catch (err) {
        dispatch(showToast(getErrorMsg(err)))
    }   
}

const initialState = {
    list: [],
    map: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case types.GET_EXCHANGES:
            const map = {}
            action.payload.forEach(e=>{
                map[e.id] = e
            })
            return {
                list: action.payload,
                map
            }
        default:
            return state
    }
}
