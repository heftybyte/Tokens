import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import QRScanner from './QRScanner';
import AccountInput from './AccountInput';
import { addAddress } from '../../reducers/account';

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
      let processedAddress = data.substr(data.search("0x"), 42);
      console.log(processedAddress);
      this.setState({inputValue: processedAddress});
  }

  onChangeText = (text) => {
    this.setState({inputValue: text});
  }

  saveAddress = async() => {
    const text = this.state.inputValue;
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

const mapDispatchToProps = (dispatch) => {
  return {
    addAddress: (address) => {
      dispatch(addAddress(address))
      dispatch(NavigationActions.back())
    }
  }
}


export default connect(null, mapDispatchToProps)(CreateAddress);
