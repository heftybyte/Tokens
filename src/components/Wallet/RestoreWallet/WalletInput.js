import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trackAddress, trackTap } from '../../../helpers/analytics'
import { baseColor, lossColor, brandColor } from '../../../config'

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
      backgroundColor: lossColor,
      borderRadius: 8,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      paddingHorizontal: 5,
      marginHorizontal: 10,
    },
    noPrice: {
      backgroundColor: baseColor,
      borderColor: '#fff'
    },
    noPriceText: {
      color: '#fff'
    },
    buttonText: {
      color: '#fff'
    }
  });

const WalletInput = ({
    toggleQRScanner,
    scannerOpen,
    inputValue,
    hasCameraPermission,
    onChangeText,
    restoreWallet,
    children
}) => {
    return (
    <View style={styles.topContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.accountInput}
            value={inputValue}
            onChangeText={onChangeText}
            placeholder={'Enter Mnemonic Phrase or Scan QR Code'}
            placeholderTextColor='#444'
          />
        </View>
        <View style={{marginVertical: scannerOpen ? 20 : 10}}>
          {children}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
          <TouchableOpacity
            onPress={()=>{trackTap('ToggleQRScanner');toggleQRScanner()}}
            disabled={!hasCameraPermission}
            style={[
                styles.buttonContainer,
                styles.noPrice
            ]}
          >
            {
              <View style={{flex:1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <MaterialCommunityIcons
                    name="qrcode"
                    size={20}
                    color="white"
                    style={{marginRight: 10}}
                  />
                <Text style={[styles.buttonText]}>{scannerOpen ? 'CLOSE' :'SCAN'}</Text>
              </View>
            }
          </TouchableOpacity>
          { !scannerOpen &&
             <TouchableOpacity
              onPress={()=>{trackAddress('Save', 'Button');restoreWallet()}}
              style={[
                  styles.buttonContainer,
                  styles.noPrice
              ]}
            >
              {
                <Text style={[styles.buttonText]}>RESTORE</Text>
              }

            </TouchableOpacity>
            }
        </View>
    </View>
    );
};

WalletInput.PropTypes = {
    toggleQRScanner: PropTypes.func.isRequired,
    scannerOpen: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    hasCameraPermission: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired,
    restoreWallet: PropTypes.func.isRequired,
}

WalletInput.defaultProps = {
    hasCameraPermission: false,
    scannerOpen: false,
}

export default WalletInput;