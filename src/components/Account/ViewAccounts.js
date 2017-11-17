import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View,
  Button,
  AsyncStorage,
  Linking
} from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Left, Right, Text, Icon, Body } from 'native-base';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { deleteAddress, refreshAddress } from '../../reducers/account';
import { logout } from '../../reducers/account';
import { withDrawer } from '../../helpers/drawer';
import { trackAddress, trackTap } from '../../helpers/analytics'
import { brandColor, invitesEnabled } from '../../config'

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
    backgroundColor: brandColor,
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
    color: brandColor,
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10
  }
});

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
        <Card>
          <CardItem
            header
            style={{backgroundColor: '#000', borderColor: '#111', borderBottomWidth: 1}}
          >
            <Text style={{color:'#fff'}}>Your Ethereum Addresses</Text>
          </CardItem>
          {addresses.map(
              (address, index) =>
              <CardItem
                key={index}
                style={{
                  backgroundColor: '#000', borderColor: '#111', borderBottomWidth: 1
                }}
              >
                <Text
                  style={{color: '#fff', fontSize: 12, flex: .8 }}
                  numberOfLines={1}
                >
                  {address.id}
                </Text>
                <Right style={{flex:.1}}>
                  <TouchableHighlight
                    style={styles.removeAddressBtn}
                    onPress={() => {trackAddress('Refresh', 'Button');refreshAddress(address.id)}}>
                    <MaterialCommunityIcons
                      name="refresh"
                      size={22}
                      color={brandColor}
                    />
                  </TouchableHighlight>
                </Right>
                <Right style={{flex:.1}}>
                  <TouchableHighlight
                    style={styles.removeAddressBtn}
                    onPress={() => {trackAddress('Delete', 'Button');deleteAddress(address.id)}}>
                    <MaterialCommunityIcons
                      name="minus-circle-outline"
                      size={22}
                      color="#b63e15"
                    />
                  </TouchableHighlight>
                </Right>
              </CardItem>
          )}
            <CardItem
              footer
              style={{backgroundColor: '#000', borderColor: '#fff'}}
            > 
              <Body />
              <Right>
                <TouchableHighlight
                  onPress={() => goToRoute('Add Address')}
                >
                  <Text style={{color:brandColor}}>+ Add Address</Text>
                </TouchableHighlight>
              </Right>
            </CardItem>
         </Card>
          {(token || id) && invitesEnabled &&
            <View>
            <Card>
              <CardItem
                header
                style={{backgroundColor: '#000', borderColor: '#111', borderBottomWidth: 1}}
              >
                <Text style={{color:'#fff'}}>Your Invites</Text>
              </CardItem>
              {invites.map(
                  (code, index) =>
                  <CardItem
                    key={index}
                    style={{
                      backgroundColor: '#000', borderColor: '#111', borderBottomWidth: 1
                    }}
                  >
                    <Text
                      style={{color: '#fff', fontSize: 12, flex: .8 }}
                      numberOfLines={1}
                    >
                      {code}
                    </Text>
                  </CardItem>
              )}
              {!invites.length && 
                <CardItem footer style={{backgroundColor: '#000'}}>
                  <TouchableHighlight
                    onPress={()=>Linking.openURL('https://twitter.com/tokens_express')}
                  >
                    <Text
                      style={{color: '#fff', fontSize: 12}}
                    >
                      Tweet <Text style={{color: brandColor, fontSize: 12}}>@tokens_express</Text> to get invites
                    </Text>
                  </TouchableHighlight>
                </CardItem>}
             </Card>
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
        invites: state.account.invites,
        ...state.ui
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
