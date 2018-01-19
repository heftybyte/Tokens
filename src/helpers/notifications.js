import { Notifications } from 'expo'
import store from '../store/index';
import { getPortfolio, getPortfolioChart } from '../reducers/account'

const handleNotification = (message) => {
	console.log('notification', { message })

	switch(message.data.type) {
		case 'ADDRESS_SCANNED':
			const { numTokens } = message.data

			if (!numTokens) {
				return	
			}

		    store.dispatch(getPortfolio(true, `Loading ${message.data.numTokens} tokens`))
			store.dispatch(getPortfolioChart())
	}
}

Notifications.addListener(handleNotification)