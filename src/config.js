import { ENVIRONMENT } from 'react-native-dotenv';
import { Constants } from 'expo'

const devUrl = Constants.isDevice ? 'http://192.168.86.215:22000' : 'http://dev.local:8888'
console.log({ENVIRONMENT})

export const baseURL = ENVIRONMENT !== 'development' ? 'https://api.tokens.express' : devUrl
export const baseColor = '#0f1110'
export const baseAccent = '#13181b'
export const gainColor = '#27A459'
export const lossColor = '#BE2B2F'
export const brandColor = '#5EECF8'
export const invitesEnabled = false
export const GOOGLE_CLIENT_ID_IOS = '947782058234-bi34g7jp0k6gf50i51clisna8j7esaer.apps.googleusercontent.com'
export const GOOGLE_CLIENT_ID_ANDROID = '947782058234-8q3galj7afvdate88ceial9mnpg9t0dl.apps.googleusercontent.com'
export const FIREBASE_API_KEY = 'AIzaSyAb1LRDJUSDfJgnBF8S1k7Sb01JMijEFmY'
export const FIREBASE_AUTH_DOMAIN = 'tokens-express-200615.firebaseapp.com'
export const FIREBASE_DATABASE_URL = 'https://tokens-express-200615.firebaseio.com'
export const FIREBASE_PROJECT_ID = 'tokens-express-200615'
export const FIREBASE_STORAGE_BUCKET = 'tokens-express-200615.appspot.com'
export const FIREBASE_MESSAGING_SENDER_ID = '947782058234'
export const COINBASE_CLIENT_ID = '030e132992e00eb796fcbf4eb1de09860ebd4fd865d462ff78265497dfef4842'
export const COINBASE_CLIENT_SECRET = '5f160e92f4c3f5b45238eadecdb0a4e1b12150cce3283f38d84d45e3c15263d6'
export const COINBASE_REDIRECT_URI = `${baseURL}/api/accounts/oauth/coinbase`

console.log({ baseURL })
