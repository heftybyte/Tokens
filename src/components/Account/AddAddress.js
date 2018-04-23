import React, { Component } from 'react';
import { Text, StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { utils } from 'ethers';
import { NavigationActions } from 'react-navigation';
import { Button, Container, Content, Form, Item, Input, StyleProvider } from 'native-base';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import QRButton from '../Common/QRButton'
import { addAddress } from '../../reducers/account';
import { withDrawer } from '../../helpers/drawer';
import { trackAddress } from '../../helpers/analytics'
import { getErrorMsg } from '../../helpers/functions'
import { showToast } from '../../reducers/ui'
import { baseAccent, baseColor, brandColor } from '../../config'
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';

const styles = StyleSheet.create({
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
    borderColor: baseAccent,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: brandColor
  },
  subHeading: {
    color: '#999',
    fontSize: 12,
    paddingVertical: 10
  },
  inputRow: {
    flex: 1,
    marginBottom: 20
  },
  input: {
    color: '#fff',
    fontSize: 14,
    borderColor: baseAccent,
    borderBottomWidth: 1,
    paddingLeft: 10
  }
});

class AddAddress extends Component {

  state = {
    address: '',
    name: ''
  }

  trackAddress = async (platform='ethereum') => {
    const { addAddress, navigate, showToast, navigation } = this.props
    const { address, name } = this.state
    try {
      if(!address || !address.length) {
        throw new Error('Enter an address to track');
      }
      const formattedAddress = utils.getAddress(address)
      await addAddress(formattedAddress, platform, name, navigation.state.params);
    } catch (err) {
      console.error(err)
      showToast(getErrorMsg(err))
    }
  }
  
  render(){
      const { address, name } = this.state
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Content>
              <View style={styles.header}>
                <Text style={styles.heading}>Add New Address</Text>
                <Text style={styles.subHeading}>
                    You can scan or enter an existing address to track its price and balance history. If you want to make transactions, import the wallet instead.
                </Text>
              </View>
              <View style={styles.scrollContainer} containerStyleContent={styles.container}>
                  <View style={styles.inputRow}>
                    <Input
                         style={styles.input}
                         placeholder="Enter or Scan Address"
                         value={address}
                         bordered
                         onChangeText={address=>this.setState({ address })}
                     />
                    <QRButton
                        style={{alignSelf: 'flex-end'}}
                        onScan={address=>this.setState({ address })}
                    />
                  </View>
                  <View style={styles.inputRow}>
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
                          title={"track"}
                          block
                          onPress={() => { this.trackAddress() }}>
                          <Text style={{color: '#000'}}>Track Address</Text>
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
    addAddress: (address, platform, name, navParams) => dispatch(addAddress(address, platform, name, navParams)),
    navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
    showToast: (params) => dispatch(_showToast(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AddAddress));
