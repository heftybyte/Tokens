import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { BarCodeScanner } from 'expo';

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
      width,
      height: 300,
      flex: 1,
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