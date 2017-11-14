import {getNewsFeed} from '../helpers/api'
import {showToast } from './ui'
import {
    getError,
} from '../helpers/functions'


export const types = {
    GET_NEWS_FEED: 'GET_NEWS_FEED',
}

export const getFeed = (data) => ({
    action: types.GET_NEWS_FEED,
    payload: data
});

export const fetchNews = () => async (dispatch, getState) => {

    const news = await getNewsFeed().catch(e=>err=e)
    if (err) {
        dispatch(showToast(getError(err)))
        return
    }

    dispatch(getFeed(news));
}


const initialState = [];

export default (state = initialState, action) => {
    switch(action.type) {
        case types.GET_NEWS_FEED:
            return action.data;
        default:
            return {
                ...state
            }
    }
}