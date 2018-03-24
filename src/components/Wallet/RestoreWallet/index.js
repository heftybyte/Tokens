import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import QRScanner from '../../Common/QRScanner';
import WalletInput from './WalletInput';
import { addWalletAddress } from '../../../reducers/account';
import { withDrawer } from '../../../helpers/drawer';
import { trackAddress } from '../../../helpers/analytics'
import { generateAddressFromPrivateKey,
        generateAddressFromMnemonic,
        storeWallet,
        isValidMnemonic, 
        isValidPrivateKey } from '../../../helpers/wallet';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000',
    height: '100%',
    padding: 10,
  },
  container: {  
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: '#f00'
  },
  header: {
    backgroundColor: '#000'
  },
});

class RestoreWallet extends Component {

  state = {
    hasCameraPermission: null,
    scannerOpen: false,
    inputValue: ''
  }


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  toggleQRScanner = () => {
    this.setState({ scannerOpen: !this.state.scannerOpen });
  }

  handleBarCodeRead = ({type, data}) => {

    this.toggleQRScanner();
    this.setState({inputValue: data});

    this.restoreWallet(data)

  }

  onChangeText = (text) => {
    this.setState({ inputValue: text });
  }

  restoreWallet = async (data, type = 'ethereum') => {
      const text = (typeof data === 'string') && data || this.state.inputValue;

      if(!text || !text.length) {
          Alert.alert('Enter an correct mnemonic or private key to save');
          return;
      }

      let address = ""
      let privateKey = ""

      if(this.isValidMnemonic(text)){
          wallet = await generateAddressFromMnemonic(text)
          if(wallet){
              address = wallet.address
              privateKey = wallet.privateKey
          }
      } else if(this.isValidPrivateKey(text)){
          address = await generateAddressFromPrivateKey(text)
          if(address){
              privateKey = text
          }
      } else {
          Alert.alert('Enter an correct mnemonic or private key to save');
          return;
      }

      const { addWalletAddress } = this.props

      const result = await storeWallet(type, privateKey, address)

      const err = await addWalletAddress(address);

      if (err){
        console.log(err)
        Alert.alert('An error occured try again')
      }
  }

  render(){
    return (
      <View style={styles.scrollContainer} containerStyleContent={styles.container}>
        <WalletInput
          toggleQRScanner={this.toggleQRScanner}
          scannerOpen={this.state.scannerOpen}
          inputValue={this.state.inputValue}
          hasCameraPermission={this.state.hasCameraPermission}
          onChangeText={this.onChangeText}
          restoreWallet={this.restoreWallet}
          children={
            <QRScanner 
              style={styles.scanner}
              scannerOpen={this.state.scannerOpen}
              handleBarCodeRead={this.handleBarCodeRead}
            />
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  ...state.ui
})

const mapDispatchToProps = (dispatch) => {
  return {
    addWalletAddress: (address) => dispatch(addWalletAddress(address)),
    navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(RestoreWallet));
