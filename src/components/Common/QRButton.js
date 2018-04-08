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
      width: '100%',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
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
      alignSelf: 'flex-end',
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
      flexDirection: 'row',
      alignSelf: 'center'
    }
  });


class QRButton extends Component {

  state = {
    scannerOpen: false,
    hasCameraPermission: false
  }

  async componentWillMount() {
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
    const { onScan } = this.props
    onScan(data)
    this.toggleQRScanner();
  }

  render() {
    const { button, style } = this.props
    const {
      scannerOpen,
      hasCameraPermission
    } = this.state
    return (
      <View style={[styles.topContainer, style]}>
          <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginVertical: scannerOpen ? 20 : 10}}>
            <QRScanner 
              style={styles.scanner}
              scannerOpen={scannerOpen}
              handleBarCodeRead={this.handleBarCodeRead}
            />
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={()=>{trackTap('ToggleQRScanner');this.toggleQRScanner()}}
              disabled={!hasCameraPermission}
              style={[
                  styles.buttonContainer
              ]}
            >
                <View style={{flex:1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={20}
                      color={brandColor}
                      style={{marginRight: 10}}
                    />
                  <Text style={[styles.buttonText]}>{scannerOpen ? 'CLOSE' :'SCAN'}</Text>
                </View>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

QRButton.propTypes = {
    onScan: PropTypes.func.isRequired
}

export default QRButton;