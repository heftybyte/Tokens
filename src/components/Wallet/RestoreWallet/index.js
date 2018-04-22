import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert, Text } from 'react-native';
import { Button, Container, Content, Form, Item, Input, StyleProvider } from 'native-base';
import { Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import QRButton from '../../Common/QRButton'
import { addWalletAddress } from '../../../reducers/account';
import { withDrawer } from '../../../helpers/drawer';
import { trackAddress } from '../../../helpers/analytics'
import {
  generateAddressFromPrivateKey,
  generateAddressFromMnemonic,
  storeWallet,
  isValidMnemonic, 
  isValidPrivateKey
} from '../../../helpers/wallet';
import { baseAccent, baseColor } from '../../../config'
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';
import styles from '../styles'
import { setLoading, showToast } from '../../../reducers/ui'

const customStyles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: baseColor,
    height: '100%',
    padding: 10,
  },
  container: {  
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: baseColor,
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: '#f00'
  },
  header: {
      paddingHorizontal: 20,
      paddingVertical: 10
  },
  heading: {
      fontSize: 16,
      paddingBottom: 10,
      paddingLeft: 10,
      borderTopWidth: 0,
      borderWidth: 0
  },
  inputRow: {
    flex: 1,
    marginBottom: 20
  },
  input: {
    color: '#fff',
    fontSize: 16,
    borderColor: baseAccent,
    borderBottomWidth: 1,
    paddingLeft: 10
  }
});

class RestoreWallet extends Component {

  static headerText = 'Import Wallet'

  state = {
    showScanner: false,
    name: null,
    secret: ''
  }

  restoreWallet = async (platform='ethereum') => {
      const { name, secret } = this.state
      if(!secret || !secret.length) {
          Alert.alert('Please enter a correct mnemonic or private key');
          return;
      }

      let address = ""
      let privateKey = ""

      try {
        if(isValidMnemonic(secret)){
            wallet = await generateAddressFromMnemonic(secret)
            if(wallet){
                address = wallet.address
                privateKey = wallet.privateKey
            }
        } else if(isValidPrivateKey(secret)){
            address = await generateAddressFromPrivateKey(secret)
            if(address){
                privateKey = secret
            }
        } else {
            Alert.alert('Enter an correct mnemonic or private key');
            return;
        }

        if (!address || !privateKey) {
          throw new Error('Invaid input given')
        }
        const { addWalletAddress, navigation } = this.props
        const { params } = navigation.state
        await storeWallet(platform, privateKey, address)
        await addWalletAddress({address, name, platform}, params)
      } catch (err) {
        console.log(err)
        showToast(getErrorMsg(err))
      }
  }

  render(){
    const { name, secret } = this.state
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Content>
            <View style={styles.header}>
              <Text style={styles.heading}>Import Existing Wallet</Text>
              <Text style={styles.subHeading}>
                  You can link your existing wallet by entering your private key or mnemonic. This will be encrypted and stored on your physical device. It never gets sent to our servers so we won’t be able to recover it for you.
              </Text>
            </View>
            <View style={customStyles.scrollContainer} containerStyleContent={customStyles.container}>
                <View style={customStyles.inputRow}>
                  <Input
                       style={styles.input}
                       placeholder="Enter or Scan Private Key / Mnemonic"
                       value={secret}
                       bordered
                       onChangeText={secret=>this.setState({ secret })}
                   />
                  <QRButton
                      style={{alignSelf: 'flex-end'}}
                      onScan={secret=>this.setState({ secret })}
                  />
                </View>
                <View style={customStyles.inputRow}>
                  <Input
                       style={styles.input}
                       placeholder="Optional Name"
                       value={name}
                       bordered
                       onChangeText={name=>this.setState({ name })}
                   />
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <Button
                        style={{flex: .8}}
                        primary
                        title={"import"}
                        block
                        onPress={() => { this.restoreWallet() }}>
                        <Text style={{color: '#000'}}>Import</Text>
                    </Button>
                </View>
            </View>
          </Content>
      </Container>
    </StyleProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  ...state.ui
})

const mapDispatchToProps = (dispatch) => {
  return {
    addWalletAddress: (address) => dispatch(addWalletAddress(address)),
    navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
    showToast: (params) => dispatch(showToast(params)),
    setLoading: (isLoading, msg) => dispatch(setLoading(isLoading, msg))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(RestoreWallet));
