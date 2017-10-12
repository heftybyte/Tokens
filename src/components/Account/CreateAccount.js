import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRScanner from './QRScanner';
import AccountInput from './AccountInput';
import { observer, inject } from 'mobx-react';

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
  scanner: {
    height: '50%'
  }
});

const addressStore = stores => ({ AddressStore: stores.store.AddressStore })

@inject(addressStore)
@observer
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

  static navigationOptions = ({ navigation }) => ({
    title: 'Account',
    headerStyle: styles.header,
    headerRight: <Ionicons style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
  })

  toggleQRScanner = () => {
    this.setState({ scannerOpen: !this.state.scannerOpen });
  }

  handleBarCodeRead = ({type, data}) => {
    this.toggleQRScanner();
    this.setState({inputValue: data});
  }

  onChangeText = (text) => {
    this.setState({inputValue: text});
  }

  saveAddress = async() => {
		const text = this.state.inputValue;
		const { AddressStore } = this.props
    if(!text || !text.length) {
      Alert.alert('Enter an address to save');
      return;
		}
		
    AddressStore.addAddress(text);
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
        />
        <QRScanner 
          style={styles.scanner}
          scannerOpen={this.state.scannerOpen}
          handleBarCodeRead={this.handleBarCodeRead}
        />
      </View>
    );
  }
}

export default CreateAddress;
