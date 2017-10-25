import { observable, action } from "mobx"
import { NavigationActions } from 'react-navigation';

type RegisterType = "anon" | "normal"

class Register {
	@observable type: RegisterType = "anon"
	@observable normal = {
		username: '',
		password: '',
		cpassword: ''
	}

	@action
	changeType = (type: RegisterType) => {
		this.type = type
	}

	navigate = (navigation) => {
		const routeName = this.type === "anon" ? "AnonymousRegisteration" : "NormalRegisteration"
		console.log({routeName})
		NavigationActions.navigate({ routeName })
	}

	@action
	changetext = (key, value) => {
		this.normal[key] = value
	}

	@action
	createAccount = () => {
		console.log('create account', NavigationActions)
		NavigationActions.navigate({ routeName: 'Dashboard' })
		if (this.normal.password !== this.normal.cpassword) {
			return
		}
		NavigationActions.navigate({ routeName: 'Dashboard' })
	}
}

export const store = new Register()