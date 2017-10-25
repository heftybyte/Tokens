import { observable, action } from "mobx"

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
		navigation.navigate(this.type === "anon" ? "AnonymousRegisteration" : "NormalRegisteration")
	}

	@action
	changetext = (key, value) => {
		this.normal[key] = value
	}

	@action
	createAccount = () => {
		if (this.normal.password !== this.normal.cpassword) {
			return
    }
	}
}

export const store = new Register()