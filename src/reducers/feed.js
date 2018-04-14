import { getNewsFeed } from '../helpers/api'
import {showToast } from './ui'
import {
    getErrorMsg,
} from '../helpers/functions'

export const types = {
    GET_NEWS_FEED: 'GET_NEWS_FEED',
}

export const getFeed = (data) => ({
    type: types.GET_NEWS_FEED,
    payload: data
});

export const fetchFeed = () => async (dispatch, getState) => {
    try {
        const accountId = getState().account.id
        const news = await getNewsFeed(accountId)
        dispatch(getFeed(news));
    } catch (err) {
        dispatch(showToast(getErrorMsg(err)))
    }   
}

const initialState = [];

export default (state = initialState, action) => {
    switch(action.type) {
        case types.GET_NEWS_FEED:
            return action.payload
        default:
            return state
    }
}
