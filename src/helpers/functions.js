import { Alert, AsyncStorage } from 'react-native'
import currencyFormatter from 'currency-formatter';
import { Permissions, Notifications, SecureStore } from 'expo';
import {
	setAuthHeader,
	registerUserForPushNotifications
} from './api';
import { setLoading } from '../reducers/ui'

export const genericError = () => {
    Alert.alert('API is busy, please try again in a few seconds. If the issue persists, please email support')
}

export const formatPrice = (price) => {
	if (price < 1) {
		return price.toFixed(5)
	}
	let [whole, decimal] = price.toFixed(2).split('.')
	return `${Number(whole).toLocaleString()}.${decimal}`
}

export const formatCurrencyChange = (change) => {
	const sign = Number(change) > 0 ? '+$' : '-$'
	change = formatPrice(Math.abs(change))
	return sign + change
}

export const getError = (err) =>
  err.response && err.response.data.error.message || err.message

export const registerForPushNotificationsAsync = async () => {
	const { status: existingStatus } = await Permissions.getAsync(
		Permissions.NOTIFICATIONS
	);
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	}

	// Stop here if the user did not grant permissions
	if (finalStatus !== 'granted') {
		return;
	}

	// Get the token that uniquely identifies this device
	let token = await Notifications.getExpoPushTokenAsync();
	let userToken = await SecureStore.getItemAsync('token')
	setAuthHeader(userToken)
	await registerUserForPushNotifications({token})
}

// Prevent progress spinner from getting stuck
export const safeAlert = (...args) => {
	const buttons = args[2] || [{text: 'OKtest'}]
	args[2] = buttons
	buttons.forEach((button)=>{
		const { onPress } = button
		button.onPress = () => {
			setLoading(false)
			onPress && onPress()
		}
	})

	const options = args[3] || {}
	const { onDismiss } = options

	args[3] = options
	options.onDismiss = () => {
		setLoading(false)
		onDismiss && onDismiss()
	}

	setTimeout(()=>Alert.alert.apply({}, args), 1)
}
