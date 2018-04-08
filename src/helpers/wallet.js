import { Wallet, utils, providers, Contract } from 'ethers';
import { ENVIRONMENT } from 'react-native-dotenv';
import { SecureStore } from 'expo'

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
    const contract = new Contract(contractAddress, abi, wallet);

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

const ETH_CONTRACT = '0x0000000000000000000000000000000000000000'
export const send = async ({publicKey, recipient, amount, contractAddress=ETH_CONTRACT, gas=21000}) => {
    const wallet = await _createEtherWallet(publicKey);
    let transaction = null
    let err = null
    const type = contractAddress === ETH_CONTRACT ? 'ether' : 'tokens'
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

    }

}

export const isValidPrivateKey=(privKey) => (privKey.length == 64)

export const isValidMnemonic=(mnemonic)=>(mnemonic.split(' ').length == 12 || mnemonic.split(' ').length == 24)