import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import PropTypes from 'prop-types';
import { BarCodeScanner, Permissions } from 'expo';

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    width,
    height: 300,
  },
  text: {
    color: '#fff',
    textAlign: 'center'
  }
});

class QRScanner extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { scannerOpen, handleBarCodeRead } = this.props;

    if (hasCameraPermission === null) {
        return <Text style={styles.text}>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text style={styles.text}>No access to camera</Text>;
    } else {
      return (
            scannerOpen ?
            <BarCodeScanner
            style={styles.container}
            onBarCodeRead={handleBarCodeRead}
            />
            : null
      );
    }
  }

}

QRScanner.PropTypes = {
    scannerOpen: PropTypes.bool.isRequired,
    handleBarCodeRead: PropTypes.func.isRequired
};

export default QRScanner;