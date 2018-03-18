/**
 * Created by Samparsky on 06/03/2018.
 */

// import bip39 from 'react-native-bip39'
import { Wallet } from 'ethers';
import { SecureStore } from 'expo'

export const GenerateMnemonic = async () => {
    // const mnemonic = await bip39.generateMnemonic(256)
    // console.log(mnemonic)
    // return mnemonic
    // return bip39.generateMnemonic()
    return "meadow much ready few bundle siren like poverty announce soon hole amateur"
}


export const StoreWallet = async(privKey, pubKey) => {
    const key = "wallet"
    const currentWallet  = await SecureStore.getItemAsync(key) ||  {}
    currentWallet[pubKey] = privKey
    SecureStore.setItemAsync(currentWallet)
}

export const GenerateAddressFromMnemonic = async (mnemonic, index=0) => {
    try {
        const path = 'm/44’/60’/0’/0/${index}'
        const wallet = Wallet.fromMnemonic(mnemonic, path);
        return { 'address': wallet.address, 'privateKey': wallet.privateKey};
    } catch(err){
        return false
    }

}

// const
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

const DeleteWallet = () => {
    
}