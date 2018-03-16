/**
 * Created by Samparsky on 06/03/2018.
 */

// import bip39 from 'react-native-bip39'
import { Wallet } from 'ethers';

export const GenerateMnemonic = async () => {
    // const mnemonic = await bip39.generateMnemonic(256)
    // console.log(mnemonic)
    // return mnemonic
    // return bip39.generateMnemonic()
    return "meadow much ready few bundle siren like poverty announce soon hole amateur"
}

export const GenerateAddressFromMnemonic = (mnemonic, index=0) => {
    const wallet = Wallet.fromMnemonic(mnemonic);
    return wallet.address;
}

// const
export const GenerateAddressFromPrivateKey = (privKey) => {
    const wallet = Wallet(privKey)
    return wallet.address;
}

const DeleteWallet = () => {
    
}