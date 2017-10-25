import { Alert } from 'react-native'
import currencyFormatter from 'currency-formatter';

export const genericError = () => {
    // Alert.alert('API is busy, please try again in a few seconds. If the issue persists, please email support')
}

export const formatPrice = (price) => {
  let [whole, decimal] = String(price).split('.')
  if (whole === '0') {
    return '0.' + (decimal || '00').substr(0,5)
  }
  if (!decimal || Number.isNaN(decimal) || decimal === 'NaN') {
    decimal = '.00'
  } else {
    decimal = '.' + decimal.substr(0,2)
  }
  let formattedPrice = Number(whole + decimal).toLocaleString()
  if (decimal.length < 3) {
    formattedPrice += '0'
  }
  return formattedPrice
}