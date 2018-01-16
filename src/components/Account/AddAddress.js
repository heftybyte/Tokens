import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import QRScanner from './QRScanner';
import AccountInput from './AccountInput';
import { addAddress } from '../../reducers/account';
import { withDrawer } from '../../helpers/drawer';
import { trackAddress } from '../../helpers/analytics'

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

class AddAddress extends Component {

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
    let processedAddress = data.substr(data.search("0x"), 42);
    this.setState({inputValue: processedAddress});
   
    trackAddress('Save', 'QRScanner')
    if (processedAddress.length !== 42 || processedAddress.substr(0,2) !== '0x') {
      Alert.alert('This Ethereum Address is Invalid')
      return
    }

    this.saveAddress(processedAddress)
  }

  onChangeText = (text) => {
    this.setState({ inputValue: text });
  }

  saveAddress = async (data) => {
    const text = (typeof data === 'string') && data || this.state.inputValue;
    const { addAddress, navigate } = this.props
    if(!text || !text.length) {
      Alert.alert('Enter an address to save');
      return;
    }
    const err = await addAddress(text);
    // Alert.alert('Allow up to 2 minutes for your address data to appear');
    if (!err) {
      await navigate('Accounts')
    }
  }

  render(){
    return (
      <View style={styles.scrollContainer} containerStyleContent={styles.container}>
        <AccountInput 
          toggleQRScanner={this.toggleQRScanner}
          scannerOpen={this.state.scannerOpen}
          inputValue={this.state.inputValue}
          hasCameraPermission={this.state.hasCameraPermission}
          onChangeText={this.onChangeText}
          saveAddress={this.saveAddress}
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
    addAddress: (address) => dispatch(addAddress(address)),
    navigate: (routeName) => dispatch(NavigationActions.navigate({ routeName }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AddAddress));
