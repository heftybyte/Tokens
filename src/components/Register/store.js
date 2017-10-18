import { observable, action } from "mobx"

type RegisterType = "anon" | "normal"

class Register {
	@observable type: RegisterType = "anon"

	@action
	changeType = (type: RegisterType) => {
		this.type = type
	}

	navigate = (navigation) => {
		navigation.navigate(this.type === "anon" ? "AnonymousRegisteration" : "NormalRegisteration")
	}
}

export const store = new Register()