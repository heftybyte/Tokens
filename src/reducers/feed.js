import { getNewsFeed } from '../helpers/api'
import {showToast } from './ui'
import {
    getError,
} from '../helpers/functions'
import { AsyncStorage } from 'react-native'

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
        dispatch(showToast(getError(err)))
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