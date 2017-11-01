import { observable, action } from "mobx"
import { Alert, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation';
import reduxStore from '../../store'
import { createAccount } from '../../reducers/account'

const uuidv4 = require('uuid/v4');

type RegisterType = "anon" | "normal"

class Register {
	@observable type: RegisterType = "normal"
	@observable normal = {
		email: '',
		password: '',
		cpassword: '',
	}
	@observable inviteCode = ''
	@observable accessKey = uuidv4()

	@action
	changeType = (type: RegisterType) => {
		this.type = type
	}

	navigate = (navigation) => {
		const routeName = this.type === "anon" ? "AnonymousRegisteration" : "NormalRegisteration"
		reduxStore.dispatch(NavigationActions.navigate({ routeName }))
	}

	@action
	changetext = (key, value) => {
		this.normal[key] = value
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
				password: this.normal.password
			}
		} else {
			// TODO: make sure to use custom endpoint for anon login, plaintext accessKey as username isn't secure enough
			params = { username: this.accessKey , accessKey: this.accessKey }
		}
		params.code = this.inviteCode
		reduxStore.dispatch(createAccount(params))
	}
}

export const store = new Register()