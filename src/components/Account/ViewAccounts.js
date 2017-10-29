import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, ScrollView, View, Button, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { deleteAddress } from '../../reducers/account';
import { logout } from '../../reducers/account';
import { withDrawer } from '../../helpers/drawer';

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
  }
});

const AddressView = ({name, index, deleteAddress}) => {
    return (
        <View style={styles.addressViewContainer}>
            <Text style={[styles.text, styles.addressText]}>{JSON.parse(name)}</Text>
            <TouchableHighlight
              style={styles.removeAddressBtn}
              onPress={() => deleteAddress(index)}>
              <MaterialCommunityIcons
                style={styles.addBtnIcon}
                name="minus-circle-outline"
                size={22}
                color="#b63e15"
              />
            </TouchableHighlight>
        </View>
    );
}

class ViewAddresses extends Component {
  addresses = [];

  static defaultProps = {
      addresses: []
  }

  deleteAddress = async(index) => {
    if(index === undefined) return;
    this.props.deleteAddress(index);
  }

  render(){
    const { id, addresses, goToRoute, logout } = this.props
    console.log({id})
    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
          <Text style={[styles.text, styles.title]}>Your Accounts</Text>
          <View>
              {addresses.map(
                  (address, index) =>
                  <AddressView
                      key={index}
                      name={address}
                      index={index}
                      deleteAddress={()=>this.deleteAddress(index)}
                  />
              )}
          </View>
          <TouchableHighlight
              style={styles.btn}
              onPress={() => goToRoute('NewAccount')}
          >
            <Text style={styles.logoutBtnText}>Add Your Ethereum Address</Text>
          </TouchableHighlight>
          {id &&
            <TouchableHighlight
                style={[styles.logoutBtn, {marginTop: 100}]}
                onPress={()=>{console.log('logout!', logout);logout()}}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableHighlight>}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        addresses: state.account.addresses,
        id: state.account.id,
        portfolio: state.account.portfolio
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteAddress: (index) => dispatch(deleteAddress(index)),
        goToRoute: (routeName) => dispatch(NavigationActions.navigate({ routeName })),
        logout: () => { dispatch(logout()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ViewAddresses));
