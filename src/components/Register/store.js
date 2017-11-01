import { observable, action } from "mobx"
import { Alert, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation';
import reduxStore from '../../store'
import { createAccount, login } from '../../reducers/account'

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
		username: uuidv4(),
		password: uuidv4(),
		code: ''
	}

	@action
	changeType = (type: RegisterType) => {
		this.type = type
	}

	navigate = async (navigation) => {
		let routeName
		let defaultEmail = ''
		const pseudonym = JSON.parse(await AsyncStorage.getItem('pseudonym') || null)
		switch(this.type) {
			case "guest":
				routeName = "GuestRegistration"
				break
			case "normal":
				routeName = "NormalRegistration"
				break
			case "login":
				if (pseudonym.type === 'email') {
					defaultEmail = pseudonym.value
				}
				routeName = "Login"
				break
		}
		// TODO: refactor hacky way of setting a deafault value
		this.login.email = defaultEmail
		reduxStore.dispatch(NavigationActions.navigate({ routeName }))
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
				username: this.guest.username,
				password: this.guest.password,
				code: this.guest.code
			}
		}
		reduxStore.dispatch(createAccount(params))
	}

	@action
	login = async () => {
		let params = {
			email: this.login.email,
			password: this.login.password
		}
		reduxStore.dispatch(login(params))
	}
}

export const store = new Register()