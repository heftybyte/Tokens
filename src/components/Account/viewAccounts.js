import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, View, Button, AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import AddressActions from '../../actionCreators/addressActions';

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

class ViewAddresses extends Component {
    addresses = [];

    static defaultProps = {
        addresses: []
    }

  async componentWillMount() {
    this.props.getAddresses();
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Accounts',
    headerStyle: styles.header,
    headerRight: <Ionicons style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
  });

  deleteAddress = async(index) => {
    if(index === undefined) return;
    this.props.deleteAddress(index);
  }

  render(){
    return (
    <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Text>Your Accounts</Text>
        <Button
            onPress={() => this.props.goToRoute('NewAccount')}
            title={'Add Address'}
        />
        <View>
            {this.props.addresses.map(
                (address, index) => 
                <AddressView 
                    key={index}
                    name={address}
                    index={index}
                    deleteAddress={this.deleteAddress}
                />
            )}
        </View>
    </ScrollView>
    );
  }
}

const mapStoreToProps = (store) => {
    return {
        addresses: store.addresses.addresses
    }
};

const mapActionCreatorsToProps = (dispatch) => {
    return {
        getAddresses: () => dispatch(AddressActions.getAddressesAction()),
        deleteAddress: (index) => dispatch(AddressActions.deleteAddressAction(index)),
        goToRoute: (routeName) => dispatch(NavigationActions.navigate({ routeName }))
    }
}

export default connect(mapStoreToProps, mapActionCreatorsToProps)(ViewAddresses);
