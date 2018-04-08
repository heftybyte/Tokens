import React, { Component } from 'react';
import QRScanner from './QRScanner';
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trackAddress, trackTap } from '../../helpers/analytics'
import { lossColor, brandColor } from '../../config'

const styles = StyleSheet.create({
    topContainer:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    accountLabel: {
      color: '#fff'
    },
    accountInput: {
      borderBottomWidth: 0,
      paddingHorizontal: 5,
      color: '#fff',
      borderRadius: 5,
      height: 40,
      fontSize: 12,
      textAlign: 'center'
    },
    inputContainer: {
      height: 40,
      width: '90%',
      backgroundColor: "#161616",
    },
    btn: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: '50%',
      height: 40,
      alignItems: 'center',
      backgroundColor: brandColor,
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row'
    },
    buttonContainer: {
      width: 110,
      height: 40,
      backgroundColor: 'transparent',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: brandColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      paddingHorizontal: 5,
      marginHorizontal: 10,
    },
    noPrice: {
      backgroundColor: '#000',
      borderColor: '#fff'
    },
    noPriceText: {
      color: '#fff'
    },
    buttonText: {
      color: brandColor
    },
    scanner: {
      flex: 1,
      alignSelf: 'center'
    }
  });


class QRButton extends Component {

  state = {
    scannerOpen: false,
    hasCameraPermission: false,
    value: null
  }

  async componentWillMount() {
    const { value } = this.props
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  }

  toggleQRScanner = () => {
    const { scannerOpen } = this.state
    this.setState({
      scannerOpen: !scannerOpen
    })
  }

  handleBarCodeRead = ({type, data}) => {
    this.toggleQRScanner();
    this.setState({ value: data });
  }

  render() {
    const { button, onChangeText, saveAddress, style } = this.props
    const {
      scannerOpen,
      value,
      hasCameraPermission
    } = this.state
    return (
      <View style={[styles.topContainer, style]}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: scannerOpen ? 20 : 10}}>
            <QRScanner 
              style={styles.scanner}
              scannerOpen={scannerOpen}
              handleBarCodeRead={this.handleBarCodeRead}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
            <TouchableOpacity
              onPress={()=>{trackTap('ToggleQRScanner');this.toggleQRScanner()}}
              disabled={!hasCameraPermission}
              style={[
                  styles.buttonContainer
              ]}
            >
              { 
                <View style={{flex:1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                  <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={20}
                      color={brandColor}
                      style={{marginRight: 10}}
                    />
                  <Text style={[styles.buttonText]}>{scannerOpen ? 'CLOSE' :'SCAN'}</Text>
                </View>
              }
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

QRButton.propTypes = {
    onChangeText: PropTypes.func.isRequired,
    saveAddress: PropTypes.func.isRequired,
}

export default QRButton;