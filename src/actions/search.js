import { AsyncStorage } from 'react-native';
import axios from 'axios';
import {FETCH_ALL_TOKENS} from '../types/tokens';
import {fetchAllTokens} from '../helpers/api';
import {genericError} from '../helpers/functions';
import Hash from 'node-object-hash';

export const createFetchAllTokensAction = (tokens) => ({
    type: FETCH_ALL_TOKENS,
    payload: tokens,
});

export const fetchAllTokens = async(dispatch, getState) => {
    //get from redux store or local storage
    const stateTokens = getState().tokens;
    let tokens = stateTokens || [];
    if(!tokens.length) {
        try{
            const tokensString = await AsyncStorage.get('tokenData');
            tokens = tokensString && tokensString.length ? JSON.parse(tokensString) : [];
        }catch($err){}
    }

    // return to redux if not empty
    if(stateTokens.length !== tokens.length){
        dispatch(createFetchAllTokensAction(tokens));
    }
    let err = null;
    const backendTokens = await fetchAllTokens().catch(e=>err=e);
    if(err) return genericError();

    let oldHash = await AsyncStorage.get('tokensHash');

    
    if(oldHash){
        let newHash = Hash(backendTokens);
        if(newHash !== oldHash)
        AsyncStorage.set('tokensHash', newHash);
        AsyncStorage.set()
    } else {
        
    }
    
    //get from backend and compare
    // return to redux if not the same
}