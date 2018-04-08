import { getBlockchains as _getBlockchains } from '../helpers/api'
import { getBlockchainImage } from '../helpers/functions'
import {showToast } from './ui'
import {
    getError,
} from '../helpers/functions'

export const types = {
    GET_BLOCKCHAINS: 'GET_BLOCKCHAINS',
}

export const getBlockchainsAction = (data) => ({
    type: types.GET_BLOCKCHAINS,
    payload: data
});

export const getBlockchains = () => async (dispatch) => {
    try {
        const blockchains = await _getBlockchains()
        const blockchainItems = blockchains.map(b=>({
            ...b,
            image: getBlockchainImage(b.name)
        }))
        dispatch(getBlockchainsAction(blockchainItems));
    } catch (err) {
        dispatch(showToast(getError(err)))
    }   
}

const initialState = {
    list: [],
    map: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case types.GET_BLOCKCHAINS:
            const map = {}
            action.payload.forEach(b=>{
                map[b.id] = b
            })
            return {
                list: action.payload,
                map
            }
        default:
            return state
    }
}