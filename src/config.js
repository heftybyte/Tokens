import { ENVIRONMENT } from 'react-native-dotenv';
import { Constants } from 'expo'

const devUrl = Constants.isDevice ? 'https://api.tokens.express' : 'http://dev.local:8888'

export const baseURL = ENVIRONMENT !== 'development' ? 'https://api.tokens.express' : devUrl
export const gainColor = '#50c992'
export const lossColor = '#c96e50'
export const brandColor = '#6b2fe2'
export const invitesEnabled = false