import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { BarCodeScanner } from 'expo';

const styles = StyleSheet.create({
    container: {  
      width: '100%',
      height: '100%'
    },
  });

const QRScanner = ({scannerOpen, handleBarCodeRead}) => {
    return (
            scannerOpen ? 
            <BarCodeScanner
            style={styles.container}
            onBarCodeRead={handleBarCodeRead}
            />
            : null
    );
}

QRScanner.PropTypes = {
    scannerOpen: PropTypes.bool.isRequired,
    handleBarCodeRead: PropTypes.func.isRequired
};

export default QRScanner;