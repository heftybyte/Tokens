import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    topContainer:{
        alignItems: 'center'
    },
    accountLabel: {
        color: '#fff'
    },
    accountInput: {
      backgroundColor: '#fff',
      width: '100%',
      height: 50,
      marginBottom: 20,
    },
    btn: {
      alignSelf: 'center',
      justifyContent: 'center',
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
        <TextInput style={styles.accountInput} value={inputValue} onChangeText={onChangeText} placeholder={'Ethereum Address'}/>
        {children}
        <TouchableHighlight onPress={toggleQRScanner} style={styles.btn} disabled={!hasCameraPermission}>
          <Text style={{color: 'white'}}>{scannerOpen ? 'Close QR Scanner' :'Scan a QR Code'}</Text>
        </TouchableHighlight>
        { !scannerOpen ? <TouchableHighlight onPress={saveAddress} style={[styles.btn, { marginBottom: 20 }]}>
          <Text style={{color: 'white'}}>Save Address</Text>
        </TouchableHighlight> : null }   
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