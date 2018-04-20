import types from '../types/alert';

export const enablePriceAlertAction = (data) => ({
    type: types.ENABLE_PRICE_ALERT,
    payload: data
});
export const disablePriceAlertAction = (data) => ({
    type: types.DISABLE_PRICE_ALERT,
    payload: data
});
export const deletePriceAlertAction = (data) => ({
    type: types.DELETE_PRICE_ALERT,
    payload: data
});
export const fetchPriceAlertAction = (data) => ({
    type: types.FETCH_PRICE_ALERT,
    payload: data
});