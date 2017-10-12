import {
	action,
	computed,
	observable
} from 'mobx'

class Address {
	@observable addresses = []

	@action
	addAddress = (address) => {
		this.addresses.push(address)
	}

	@action
	asyncAddAddress = (addresses) => {
		this.addresses.push(...addresses)
	}

	@action
	remove = (address) => {
		this.addresses.delete(address)
	}
}

export const store = new Address()