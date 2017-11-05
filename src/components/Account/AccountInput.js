import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trackAddress, trackTap } from '../../helpers/analytics'

const styles = StyleSheet.create({
    topContainer:{
        alignItems: 'center'
    },
    accountLabel: {
        color: '#fff'
    },
    accountInput: {
      borderBottomWidth: 0,
      paddingHorizontal: 5,
      color: '#fff',
      borderRadius: 5,
      width: '100%',
      height: 40,
      fontSize: 12,
      textAlign: 'center'
    },
    inputContainer: {
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
      flexDirection: 'row',
      marginTop: 20,
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
            placeholder={'Enter Ethereum Address'}
            placeholderTextColor='#333'
          />
        </View>
        {children}
        { !scannerOpen ? <TouchableHighlight onPress={()=>{trackAddress('Save', 'Button');saveAddress()}} style={[styles.btn, { marginBottom: 20 }]}>
          <Text style={{color: 'white'}}>Save Address</Text>
        </TouchableHighlight> : null }   
        <TouchableHighlight
          onPress={()=>{trackTap('Toggle QRScanner');toggleQRScanner()}}
          disabled={!hasCameraPermission}
        >
          <View style={styles.btn}>
            <MaterialCommunityIcons
                name="qrcode"
                size={22}
                color="white"
                style={{padding: 0, margin: 0,marginRight: 10}}
              />
            <Text style={{color: 'white'}}>{scannerOpen ? 'Close QR Scanner' :'Scan QR Code'}</Text>
          </View>
        </TouchableHighlight>
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