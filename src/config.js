import { ENVIRONMENT } from 'react-native-dotenv';
import { Constants } from 'expo'

const devUrl = Constants.isDevice ? 'https://api.tokens.express' : 'http://dev.local:8888'
console.log({ENVIRONMENT})

export const baseURL = ENVIRONMENT !== 'development' ? 'https://api.tokens.express' : devUrl
export const gainColor = '#50c992'
export const lossColor = '#c96e50'
export const brandColor = '#3FB6C6'
export const invitesEnabled = false

console.log({ baseURL })