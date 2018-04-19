import { ENVIRONMENT } from 'react-native-dotenv';
import { Constants } from 'expo'

// const devUrl = Constants.isDevice ? 'https://api.tokens.express' : 'http://dev.local:8888'
const devUrl = Constants.isDevice ? 'https://api.tokens.express' : 'http://0.0.0.0:3000'

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

console.log({ baseURL })
