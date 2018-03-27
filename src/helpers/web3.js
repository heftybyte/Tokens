/**
 * for local testing
const Web3 = require('web3');
**/
import { ENVIRONMENT } from 'react-native-dotenv';

const Web3 = require('web3');
let web3 = null;

if (ENVIRONMENT !== 'development'){
    web3 = new Web3();
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

export default web3;