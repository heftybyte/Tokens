import { Wallet, utils, providers, Contract } from 'ethers';
import { ENVIRONMENT } from 'react-native-dotenv';
import { SecureStore } from 'expo'
import web3 from './web3';

export const storeWallet = async(type, privKey, pubKey) => {
    const key = "wallet"

    let currentWallet  = await SecureStore.getItemAsync(key) ||  {}

    currentWallet[type] = { ...currentWallet[type], pubKey: privKey }

    const result = await SecureStore.setItemAsync(key, JSON.stringify(currentWallet));

    return result
}

export const generateAddressFromMnemonic = async (mnemonic, index=0) => {
    try {
        const path = `m/44'/60'/0'/0/${index}`
        const wallet = Wallet.fromMnemonic(mnemonic, path);
        return { 'address': wallet.address, 'privateKey': wallet.privateKey};
    } catch(err){
        console.log(err)
        return false
    }

}

export const generateAddressFromPrivateKey = async (privateKey) => {
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


const _getEtherProvider = () => ( ENVIRONMENT !== 'development'
    ? providers.getDefaultProvider() :
    new providers.JsonRpcProvider('http://localhost:7545', providers.networks.ropsten) )

const _sendEther = async (wallet, recipient, amount) => {
    let err = null
    wallet.provider = _getEtherProvider()
    amount = utils.parseEther(amount.toString());
    const transaction = await wallet.send(recipient, amount).catch(e=>err=e);
    if(err)throw err;
    return transaction;
}

const _sendTokens = async(wallet, recipient, amount, contractAddress) => {
    let err = null
    const abi = require('human-standard-token-abi')
    wallet.provider = _getEtherProvider()
    const token = new web3.eth.Contract(abi, contractAddress)
    const contract = new Contract(contractAddress, token._jsonInterface, wallet);

    const transaction = await contract.transfer(recipient, amount).catch(e=>err=e)
    if(err)throw err
    return transaction
}

const _createEtherWallet = async(publicKey) => {
    const storedWallet = await SecureStore.getItemAsync("wallet");
    const privateKey = storedWallet['ethereum'][publicKey]

    const wallet = new Wallet(privateKey)
    return wallet
}

export const send = async (type='ether', publicKey, recipient, amount, contractAddress=null) => {
    const wallet = await _createEtherWallet(publicKey);
    let transaction = null
    let err = null

    switch(type) {
        case 'ether':
            transaction = await _sendEther(wallet, recipient, amount).catch(e=>err=e)
            if(err)throw err
            return transaction;
            break;
        case 'tokens':
            transaction = await _sendTokens(wallet, recipient, amount, contractAddress).catch(e=>err=e)
            if(err)throw err
            return transaction
            break;
        default:
            console.log('Waving Flag')

    }

}

export const isValidPrivateKey=(privKey) => (privKey.length == 64)

export const isValidMnemonic=(mnemonic)=>(mnemonic.split(' ').length == 12 || mnemonic.split(' ').length == 24)
