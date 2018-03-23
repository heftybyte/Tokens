import { Wallet } from 'ethers';
import { SecureStore } from 'expo'

export const StoreWallet = async(type, privKey, pubKey) => {
    const key = "wallet"

    let currentWallet  = await SecureStore.getItemAsync(key) ||  {}

    currentWallet[type] = { ...currentWallet[type], pubKey: privKey }

    const result = await SecureStore.setItemAsync(key, JSON.stringify(currentWallet));

    return result
}

export const GenerateAddressFromMnemonic = async (mnemonic, index=0) => {
    try {
        const path = `m/44'/60'/0'/0/${index}`
        const wallet = Wallet.fromMnemonic(mnemonic, path);
        return { 'address': wallet.address, 'privateKey': wallet.privateKey};
    } catch(err){
        console.log(err)
        return false
    }

}

export const GenerateAddressFromPrivateKey = async (privateKey) => {
    try {
        if (privateKey.substring(0, 2) !== '0x') { privateKey = '0x' + privateKey; }
        const wallet = new Wallet(privateKey);
        // console.log(wallet)
        return wallet.address;

    } catch (err){
        console.log(err)
        return false
    }

}

export const isValidPrivateKey=(privKey) => (privKey.length == 64)

export const isValidMnemonic=(mnemonic)=>(mnemonic.split(' ').length == 12 || mnemonic.split(' ').length == 24)
