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

class CreateAddress extends Component {

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

      if (data.length !== 42 || data.substr(0,2) !== '0x') {
        Alert.alert('This Ethereum Address is Invalid')
        return
      }

      this.saveAddress(data)
  }

  onChangeText = (text) => {
    this.setState({inputValue: text});
  }

  saveAddress = async(data) => {
    const text = data || this.state.inputValue;
    if(!text || !text.length) {
      Alert.alert('Enter an address to save');
      return;
    }
    this.props.addAddress(text);
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
        >
        <QRScanner 
          style={styles.scanner}
          scannerOpen={this.state.scannerOpen}
          handleBarCodeRead={this.handleBarCodeRead}
        />
        </AccountInput>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio
})

const mapDispatchToProps = (dispatch) => {
  return {
    addAddress: (address) => {
      dispatch(addAddress(address))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(CreateAddress));
