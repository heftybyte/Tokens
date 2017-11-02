import { AsyncStorage } from 'react-native';
import axios from 'axios';
import TokenTypes from '../types/tokens';
import {getAllTokens} from '../helpers/api';
import {genericError} from '../helpers/functions';
import Hash from 'object-hash';

export const createFetchAllTokensAction = (tokens, checksum) => ({
    type: TokenTypes.FETCH_ALL_TOKENS,
    payload: {tokens, checksum}
});

export const fetchTokens = () => async(dispatch, getState) => {
    //get from redux store or local storage
    const reduxState = getState();
    const stateTokens = reduxState.search.tokens;
    const fetchedFromStorage = reduxState.search.fetchedFromStorage;
    let stateChecksum = reduxState.search.checksum;

    const storedChecksum = await AsyncStorage.getItem('tokensChecksum');

    // if it's been fetched from AsyncStorage already don't try again.
    // if there's nothing in the storage fall back to redux store.
    const tokens = fetchedFromStorage ? stateTokens : await getTokensFromStorage(dispatch) || stateTokens;

    // dispatch early so the user doesn't have to wait for the backend call.
    if(storedChecksum && storedChecksum !== stateChecksum) {
        dispatch(createFetchAllTokensAction(tokens, storedChecksum));
        stateChecksum = storedChecksum;
    }

    const response = await getAllTokens(stateChecksum).catch(e=> genericError());
    
    // only dispatch if there was a change.
    if (!response.didNotChange) {
        dispatch(createFetchAllTokensAction(response.tokens, response.checksum));
        AsyncStorage.setItem('tokens', JSON.stringify(response.tokens));
        AsyncStorage.setItem('tokensChecksum', response.checksum);
    }
}

const getTokensFromStorage = async(dispatch) => {
    const storedTokens = await AsyncStorage.getItem('tokens');

    // tell the store we've fetched from AsyncStorage
    dispatch({type: TokenTypes.FETCHED_FROM_STORAGE});
    if(storedTokens) return JSON.parse(storedTokens);
    return null;
}