import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
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
        height: '20%',
    },
  });

const AccountInput = ({toggleQRScanner, scannerOpen, inputValue, hasCameraPermission, onChangeText}) => {
    return (
    <View style={styles.topContainer}>
        <Text style={styles.accountLabel}>Account:</Text>
        <TextInput style={styles.accountInput} value={inputValue} onChangeText={onChangeText}/>
        <Button onPress={toggleQRScanner} title={scannerOpen ? 'Close QR Scanner' :'Scan a QR Code'} disabled={!hasCameraPermission}/>
    </View>
    );
};

AccountInput.PropTypes = {
    toggleQRScanner: PropTypes.func.isRequired,
    scannerOpen: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    hasCameraPermission: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired
}

AccountInput.defaultProps = {
    hasCameraPermission: false,
    scannerOpen: false
}

export default AccountInput;