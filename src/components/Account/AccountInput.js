import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight, TouchableOpacity } from 'react-native';
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
      backgroundColor: '#6b2fe2',
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
      backgroundColor: '#000',
      borderColor: '#fff'
    },
    noPriceText: {
      color: '#fff'
    },
    buttonText: {
      color: '#fff'
    }
  });

const AccountInput = ({
    toggleQRScanner,
    scannerOpen,
    inputValue,
    hasCameraPermission,
    onChangeText,
    saveAddress,
    children
}) => {
    return (
    <View style={styles.topContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.accountInput}
            value={inputValue}
            onChangeText={onChangeText}
            placeholder={'Enter Ethereum Address or scan QR code'}
            placeholderTextColor='#444'
          />
        </View>
        <View style={{marginVertical: scannerOpen ? 20 : 10}}>
          {children}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
          <TouchableOpacity
            onPress={()=>{trackTap('Toggle QRScanner');toggleQRScanner()}}
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
              onPress={()=>{trackAddress('Save', 'Button');saveAddress()}}
              style={[
                  styles.buttonContainer,
                  styles.noPrice
              ]}
            >
              {
                <Text style={[styles.buttonText]}>SAVE</Text>
              }

            </TouchableOpacity>
            }
        </View>
    </View>
    );
};

AccountInput.PropTypes = {
    toggleQRScanner: PropTypes.func.isRequired,
    scannerOpen: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    hasCameraPermission: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired,
    saveAddress: PropTypes.func.isRequired,
}

AccountInput.defaultProps = {
    hasCameraPermission: false,
    scannerOpen: false,
}

export default AccountInput;