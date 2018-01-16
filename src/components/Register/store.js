import { observable, action } from "mobx"
import { Alert, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation';
import reduxStore from '../../store'
import { createAccount, login } from '../../reducers/account'
import { DURATION } from 'react-native-easy-toast'

const uuidv4 = require('uuid/v4');

type RegisterType = "guest" | "normal" | "login"

class Register {
	@observable type: RegisterType = "login"
	@observable normal = {
		email: '',
		password: '',
		cpassword: '',
		code: ''
	}
	@observable login = {
		email: '',
		password: ''
	}
	@observable guest = {
		email: '',
		password: '',
		code: ''
	}
	@observable toast = ''

	@action
	changeType = (type: RegisterType) => {
		this.type = type
	}

	timeoutId = 0

	navigate = async (navigation) => {
		let routeName
		let defaultEmail = ''
		const pseudonym = JSON.parse(await AsyncStorage.getItem('pseudonym') || null)
		switch(this.type) {
			case "guest":
				routeName = "GuestRegistration"
				this.guest.email = uuidv4()
				this.guest.password = uuidv4()
				break
			case "normal":
				routeName = "NormalRegistration"
				break
			case "login":
				if (pseudonym && pseudonym.type === 'email') {
					defaultEmail = pseudonym.value
				}
				routeName = "Login"
				break
		}
		// TODO: refactor hacky way of setting a deafault value
		this.login.email = defaultEmail
		await reduxStore.dispatch(NavigationActions.navigate({ routeName }))
		this.login.email = defaultEmail
	}

	@action
	changetext = (key, value) => {
		let sanitized = value && value.trim && value.trim()
		this[this.type][key] = sanitized || value
	}

	@action
	getField = (key) => {
		return this[this.type][key]
	}
	
	@action
	createAccount = async () => {
		let params
		if (this.type === 'normal') {
			if (this.normal.password !== this.normal.cpassword) {
				Alert.alert('Passwords must match')
				return
			}
			params = {
				email: this.normal.email,
				password: this.normal.password,
				code: this.normal.code
			}
		} else {
			params = {
				email: this.guest.email,
				password: this.guest.password,
				code: this.guest.code
			}
		}
		await reduxStore.dispatch(createAccount(params))
		this.showToast(reduxStore.getState().ui.toast)
	}

	@action
	login = async () => {
		let params = {
			email: this.login.email,
			password: this.login.password
		}
		await reduxStore.dispatch(login(params))
		this.showToast(reduxStore.getState().ui.toast)
	}

	showToast = (toast) => {
		if (toast !== this.toast) {
			clearTimeout(this.timeoutId)
		}
		this.timeoutId = setTimeout(()=>this.toast = '', DURATION.LENGTH_LONG)
		this.toast = toast
	}
}

export const store = new Register()