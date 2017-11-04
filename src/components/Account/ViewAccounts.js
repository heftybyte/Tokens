import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View,
  Button,
  AsyncStorage,
  Alert,
  Linking
} from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { deleteAddress, refreshAddress } from '../../reducers/account';
import { logout } from '../../reducers/account';
import { withDrawer } from '../../helpers/drawer';
import { trackAddress, trackTap } from '../../helpers/analytics'

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000',
    padding: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: '#f00',
    position: 'relative'
  },
  header: {
    backgroundColor: '#000'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  text:{
      color: '#fff',
  },
  centerText: {
    textAlign: 'center'
  },
  btn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6b2fe2',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row'
  },
  logoutBtn: {

  },
  logoutBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  addressViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20
  },
  removeAddressBtn: {
    flex: .1
  },
  addressText: {
    flex: .8,
    fontSize: 10
  },
  inviteHeader: {
    marginTop: 30
  },
  inviteText: {
    color: '#6b2fe2',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10
  }
});

const AddressView = ({name, address, deleteAddress, refreshAddress}) => {
    return (
        <View style={styles.addressViewContainer}>
            <Text style={[styles.text, styles.addressText]}>{name}</Text>
            <TouchableHighlight
              style={styles.removeAddressBtn}
              onPress={() => {trackAddress('Refresh', 'Button');refreshAddress(address)}}>
              <MaterialCommunityIcons
                name="refresh"
                size={22}
                color="#6b2fe2"
              />
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.removeAddressBtn}
              onPress={() => {trackAddress('Delete', 'Button');deleteAddress(address)}}>
              <MaterialCommunityIcons
                name="minus-circle-outline"
                size={22}
                color="#b63e15"
              />
            </TouchableHighlight>
        </View>
    );
}

class ViewAddresses extends Component {

  render(){
    const {
      token,
      id,
      addresses,
      goToRoute,
      logout,
      invites,
      deleteAddress,
      refreshAddress
    } = this.props
    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
          <Text style={[styles.text, styles.title]}>Your Accounts</Text>
          <View>
              {addresses.map(
                  (address, index) =>
                  <AddressView
                      key={index}
                      name={address.id}
                      address={address.id}
                      deleteAddress={deleteAddress}
                      refreshAddress={refreshAddress}
                  />
              )}
          </View>
          <TouchableHighlight
              style={styles.btn}
              onPress={() => goToRoute('NewAccount')}
          >
            <Text style={styles.logoutBtnText}>Add Your Ethereum Address</Text>
          </TouchableHighlight>
          {(token || id) &&
            <View style={{marginTop: 40, paddingTop: 10, borderTopWidth: 1, borderColor: '#6b2fe2'}}>
              <Text style={[styles.text, styles.title, styles.inviteHeader]}>Your Invite Code(s)</Text>
              {
                  invites.length ?
                    invites.map((code, index)=>
                        <Text key={index} style={[styles.inviteText]}>{code}</Text>
                    ) :
                    <TouchableHighlight
                      onPress={()=>Linking.openURL('https://twitter.com/tokens_express')}
                    >
                      <Text
                        style={[styles.text, styles.centerText, {fontSize: 12}]}
                      >
                        Tweet <Text style={{color: '#6b2fe2'}}>@tokens_express</Text> to get invites
                      </Text>
                    </TouchableHighlight>
              }
              <TouchableHighlight
                  style={[styles.logoutBtn, {marginTop: 100}]}
                  onPress={()=>{trackTap('Logout');logout()}}
              >
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableHighlight>
            </View>}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        addresses: state.account.addresses,
        token: state.account.token,
        id: state.account.id,
        portfolio: state.account.portfolio,
        invites: state.account.invites
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteAddress: (address) => dispatch(deleteAddress(address)),
        refreshAddress: (address) => dispatch(refreshAddress(address)),
        goToRoute: (routeName) => dispatch(NavigationActions.navigate({ routeName })),
        logout: () => { dispatch(logout()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ViewAddresses));
