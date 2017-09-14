import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, View, Button } from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRScanner from '../QRScanner';
import AccountInput from '../AccountInput';

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

export default class Account extends Component {

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

  render(){
    return (
      <View style={styles.scrollContainer} containerStyleContent={styles.container}>
        <AccountInput 
          toggleQRScanner={this.toggleQRScanner}
          scannerOpen={this.state.scannerOpen}
          inputValue={this.state.inputValue}
          hasCameraPermission={this.state.hasCameraPermission}
          onChangeText={this.onChangeText}
        />
        <QRScanner style={styles.scanner} scannerOpen={this.state.scannerOpen} handleBarCodeRead={this.handleBarCodeRead}/>
      </View>
    );
  }
}
