import { AsyncStorage } from 'react-native';
import types from '../reducers/reducerTypes';

export default {
    createAddressAction: (address) => (dispatch, getState) => createNewAddress(dispatch, getState, address),
    deleteAddressAction: (index) => (dispatch, getState) => deleteAddress(dispatch, getState, index),
    getAddressesAction: () => (dispatch, getState) => getAddresses(dispatch, getState)
}


const createNewAddress = async(dispatch, getState, address) => {
    try{
        const state = getState();
        const { addresses } = state; 
        let newAddresses = [...addresses.addresses];
        newAddresses.push(address);
        const addressesString = JSON.stringify(newAddresses);
        await AsyncStorage.setItem('addresses', addressesString);
        dispatch({
            type: types.ADD_ADDRESS,
            payload: {address}
        });
    } catch (error) {
        dispatch({
            type: types.MODIFY_ADDRESSES_FAILED,
            payload: {
                error: 'An error occurred deleting this address'
            }
        });
    }
};


const deleteAddress = async(dispatch, getState, index) => {
    try {
        const state = getState();
        const { addresses } = state; 
        let newAddresses = [...addresses.addresses];
        newAddresses = newAddresses.filter((address, i) => index !== i);
        const addressesString = JSON.stringify(newAddresses);
        await AsyncStorage.setItem('addresses', addressesString);
        dispatch({
            type: types.REMOVE_ADDRESS,
            payload: {index}
        });
    } catch (error) {
        dispatch({
            type: types.MODIFY_ADDRESSES_FAILED,
            payload: {
                error: 'An error occurred deleting this address'
            }
        });
    }
};

const getAddresses = async(dispatch, getState) => {
    const state = getState();
    let { addresses } = state;
    addresses = [...addresses.addresses];
    addresses = addresses.length ? addresses : await AsyncStorage.getItem('addresses');
    addresses = addresses ? JSON.parse(addresses) : [];
    dispatch({
        type: types.GET_ADDRESSES,
        payload: {addresses}
    });
};