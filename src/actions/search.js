import { AsyncStorage } from 'react-native';
import axios from 'axios';
import TokenTypes from '../types/tokens';
import {getAllTokens} from '../helpers/api';
import {genericError} from '../helpers/functions';
import Hash from 'object-hash';

export const createFetchAllTokensAction = (tokens) => ({
    type: TokenTypes.FETCH_ALL_TOKENS,
    payload: tokens,
});

export const fetchTokens = () => async(dispatch, getState) => {

    //get from redux store or local storage
    const stateTokens = getState().search.tokens;

    let tokens = stateTokens;
    if(!tokens.length) {
        try{
            const tokensString = await AsyncStorage.getItem('tokenData');
            tokens = tokensString && tokensString.length ? JSON.parse(tokensString) : [];
        }catch($err){}
    }

    // return to redux if changed
    if(stateTokens.length !== tokens.length){
        dispatch(createFetchAllTokensAction(tokens));
    }


    let err = null;
    const backendTokens = await getAllTokens().catch(e=>err=e);
    if(err) return genericError();

    const oldHash = await AsyncStorage.getItem('tokensHash');
    const newHash = Hash(backendTokens);

    if(!oldHash && backendTokens.length || newHash !== oldHash){
        AsyncStorage.setItem('tokensHash', newHash);
        AsyncStorage.setItem('tokenData', JSON.stringify(backendTokens));
        dispatch(createFetchAllTokensAction(backendTokens));
    }
}