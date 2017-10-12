import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, View, Button, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { observer, inject } from 'mobx-react';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000',
    height: '100%',
    padding: 10,
  },
  container: {  
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: '#f00'
  },
  header: {
    backgroundColor: '#000'
  },
  text:{
      color: '#fff',
  }
});

const AddressView = ({name, index, deleteAddress}) => {
    return (
        <View>
            <Text style={styles.text}>{name}</Text>
            <Button 
                title={"-"}
                onPress={() => deleteAddress(index)}
             />
        </View>
    );
}

const addressStore = stores => ({ AddressStore: stores.store.AddressStore })

@inject(addressStore)
@observer
class ViewAddresses extends Component {
  addresses = [];

  static defaultProps = {
      addresses: []
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Accounts',
    headerStyle: styles.header,
    headerRight: <Ionicons style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
  });

  deleteAddress = (address) => {
		const { AddressStore } = this.props
    AddressStore.remove(address);
  }

  render(){
    const { AddressStore, navigation: { navigate } } = this.props

    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
          <Text>Your Accounts</Text>
          <Button
              onPress={() => navigate('NewAccount')}
              title={'Add Address'}
          />
          <View>
              {AddressStore.addresses.map(
                  (address, index) => 
                  <AddressView 
                      key={index}
                      name={address}
                      index={index}
                      deleteAddress={()=>this.deleteAddress(address)}
                  />
              )}
          </View>
      </ScrollView>
    );
  }
}

export default ViewAddresses;
