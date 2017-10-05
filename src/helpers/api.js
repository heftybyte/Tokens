import axios from 'axios';
import Expo from 'expo';

const baseUrl =  process.env.NODE_ENV === 'production' ? 'https://erc-20.io' : 'http://localhost:3020';
const deviceId = Expo.Constants.deviceId;

let instance = axios.create({
  baseUrl,
  headers: { 'Authorization': `token ${deviceId}` }
});

export const registerUser = async () => {
  let response = await instance.post(`${baseUrl}/account/register`, {deviceId});

  return response.data;
};