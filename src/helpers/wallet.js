import { Wallet, utils, providers, Contract } from 'ethers';
import { ENVIRONMENT } from 'react-native-dotenv';
import { SecureStore } from 'expo'
const abi = require('human-standard-token-abi')
const WALLET_KEY = 'wallet'

export const storeWallet = async(type, privKey, pubKey) => {
    const address = utils.getAddress(pubKey)
    const currentWallet = JSON.parse(await SecureStore.getItemAsync(WALLET_KEY) ||  '{}')
    currentWallet[type] = { ...currentWallet[type], [address]: privKey }
    const result = await SecureStore.setItemAsync(WALLET_KEY, JSON.stringify(currentWallet));
    return result
}

export const hasWallet = async (type, pubKey) => {
    const address = utils.getAddress(pubKey)
    const currentWallet = JSON.parse(await SecureStore.getItemAsync(WALLET_KEY) ||  '{}')
    console.log({currentWallet,type, address,['!!(currentWallet[type] && currentWallet[type][address])']:!!(currentWallet[type] && currentWallet[type][address])})
    return !!(currentWallet[type] && currentWallet[type][address])
}

export const removeWallet = async (type, pubKey) => {
    const address = utils.getAddress(pubKey)
    const currentWallet  = await SecureStore.getItemAsync(WALLET_KEY) ||  {}
    if (currentWallet && currentWallet[type]) {
        delete currentWallet[type][address]
        const result = await SecureStore.setItemAsync(WALLET_KEY, JSON.stringify(currentWallet));
    }
    return false
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

const _sendEther = async (wallet, to, amount) => {
    let err = null
    const recipient = utils.getAddress(to)
    wallet.provider = _getEtherProvider()
    amount = utils.parseEther(amount.toString());
    const transaction = await wallet.send(recipient, amount).catch(e=>err=e);
    if(err)throw err;
    return transaction;
}

const _sendTokens = async(wallet, to, amount, contractAddress) => {
    let err = null
    const recipient = utils.getAddress(to)
    wallet.provider = _getEtherProvider()
    const contract = new Contract(contractAddress, abi, wallet);

    const transaction = await contract.transfer(recipient, amount).catch(e=>err=e)
    if(err)throw err
    return transaction
}

const _createEtherWallet = async(publicKey) => {
    const address = utils.getAddress(publicKey)
    const storedWallet = await SecureStore.getItemAsync("wallet");
    if (!storedWallet) throw new Error('No wallets found')
    const privateKey = storedWallet['ethereum'][address]
    const wallet = new Wallet(privateKey)
    return wallet
}

const ETH_CONTRACT = '0x0000000000000000000000000000000000000000'
export const send = async ({publicKey, to, amount, contractAddress=ETH_CONTRACT, gas=21000}) => {
    const wallet = await _createEtherWallet(publicKey);
    let transaction = null
    let err = null
    const recipient = utils.getAddress(to)
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