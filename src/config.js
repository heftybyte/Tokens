import { ENVIRONMENT } from 'react-native-dotenv';
import { Constants } from 'expo'

const devUrl = Constants.isDevice ? 'https://api.tokens.express' : 'http://dev.local:8888'
console.log({ENVIRONMENT})

export const baseURL = ENVIRONMENT !== 'development' ? 'https://api.tokens.express' : devUrl
export const baseColor = '#0f1110'
export const baseAccent = '#13181b'
export const gainColor = '#27A459'
export const lossColor = '#BE2B2F'
export const brandColor = '#5EECF8'
export const invitesEnabled = false

console.log({ baseURL })