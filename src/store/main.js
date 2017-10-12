import { observable, action, computed } from "mobx"
import { AsyncStorage } from 'react-native'

import {genericError} from '../helpers/functions';
import {
    loginAccount,
    registerAccount,
    setAuthHeader,
    getAccountPortfolio,
    addAccountAddress,
    getAccount
} from '../helpers/api'

class Main {
	@observable addresses = []
	@observable isLoggedIn = false
  @observable id = null
  @observable token = null
	@observable portfolio = {}
	@observable account = {}

	@action
	loggedIn = (status) => {
		this.isLoggedIn = status
	}
	
	@action
	login = async () => {
    let token = await AsyncStorage.getItem('token')

    if (!token) {
			try {
				const res = await loginAccount(this.id)
				token = res.id
				
				setAuthHeader(token)
				await AsyncStorage.setItem('token', token)
				this.token = token				
			} catch(e) {
				genericError()
				return
			}
		}
    
		try {
			const account = await getAccount(this.id)
			await AsyncStorage.setItem('account', JSON.stringify(account))	
			this.account = account		
		} catch(e) {
			genericError()
			return
		}
	}

	@action
	addAddress = async (address) => {
		try {
			const account = await addAccountAddress(this.id, address)
			this.account = account			
		} catch(e) {
			genericError()
			return
		}
	}

	@action
	getPortfolio = () => async (dispatch, getState) => {
		dispatch(portfolioAction(portfolio))
		try {
			const portfolio = await getAccountPortfolio(this.id)
			this.portfolio = portfolio			
		} catch(e) {
			genericError()
			return
		}
	}

	@action
	register = async () => {
		try {
			const account = JSON.parse(await AsyncStorage.getItem('account') || null) || 
				await registerAccount()
			
			if (!account) {
				throw new Error()
			}

			await AsyncStorage.setItem('account', JSON.stringify(account))
			this.id = account.id
		} catch(e) {
			genericError()
			return
		}

    if (err || !account) {
        return 
    }
	}
}

export const store = new Main()
