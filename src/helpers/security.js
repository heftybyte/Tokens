import { SecureStore } from 'expo'

const key = 'pin'

export const storePin = async (pin) => {
    const result = await SecureStore.setItemAsync(key, pin)
    return result
}

export const getPin = async() => {
    const result = await  SecureStore.getItemAsync(key)
    return result
}

export const deletePin = async() => {
    const result = await SecureStore.deleteItemAsync(key)
    return result
}