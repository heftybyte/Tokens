import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import PriceChart from '../PriceChart';
import TokenList from '../TokenList';
import Header from './Header';
import News from './News';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import mockTokens from '../../../mockTokens';
import { registerUser } from '../../helpers/api';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000'
  },
  portfolioValueCurrencySymbol: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Helvetica'
  },
  portfolioValue: {
    color: '#fff',
    fontSize: 60,
    fontFamily: 'Helvetica'
  },
  portfolioValueCents: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Helvetica'
  },
  portfolioDelta: {
    color: '#fff',
    fontSize: 15
  },
  portfolioDeltaPeriod: {
    fontSize: 15,
    color: '#c1c0bf',
    fontWeight: 'bold'
  },
  gain: {
    color: '#1bcca4'
  },
  loss: {
    color: '#b63e15'
  }
});


class Dashboard extends Component {
  componentWillMount(){
    this.registerUserDevice();
    this.checkIfHasAddress();
  }

  registerUserDevice = async () => {
    const deviceRegistered = await AsyncStorage.getItem('deviceRegistered');

    if (!deviceRegistered) {
      try {
        let userPayload = await registerUser();
        userPayload.accessToken ? AsyncStorage.setItem('accessToken', userPayload.accessToken) : null;
        AsyncStorage.setItem('deviceRegistered', 'true');
      } catch(ex) {
        Alert.alert('API is busy, please try again in a few seconds. If the issue persists, please email support')
      }
    }
  }

  checkIfHasAddress = async() => {
    let addresses = await AsyncStorage.getItem('addresses');
    addresses = addresses ? JSON.parse(addresses) : [];
    if(!addresses.length) {
      Alert.alert('Please add an ethereum addresss');
      this.props.goToAddressPage();
    }
  }

  render = () => (
    <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
      <Header totalValue={mockTokens.totalValue} />
      <PriceChart />
      <News />
      <TokenList tokens={mockTokens.tokens} />
    </ScrollView>
  );
}

Dashboard.navigationOptions = ({ navigation }) => ({
  // the title  is also used as the label for the back button
  title: `${navigation.state.price || 'Dashboard'}`,
  headerStyle: styles.header,
  headerLeft:(
        <MaterialCommunityIcons
          style={{paddingLeft:20}}
          name="menu"
          size={22}
          color="white"
          onPress={()=>{navigation.dispatch({type: 'Accounts'})}}
        />),
  headerRight: <Ionicons onClick={()=>{}} style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
});

const mapDispatchToProps = (dispatch) => {
  return {
    goToAddressPage: () => dispatch(NavigationActions.navigate({ routeName: 'Accounts' }))
  }
};

export default connect(null, mapDispatchToProps)(Dashboard);
