import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import PriceChart from '../PriceChart';
import TokenList from '../TokenList';
import Header from './Header';
import News from '../NewsFeed';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import mockTokens from '../../../mockTokens';
import { register, login, getPortfolio } from '../../reducers/account';

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
  componentWillMount = async() =>{
    const { login, register, getPortfolio } = this.props
    console.log('setting up account')
    await register()
    await login()
    console.log('account setup')
  }

  componentWillReceiveProps = async (nextProps) => {
    const { addresses, loggedIn, getPortfolio} = nextProps

    if (addresses.length) {
      await getPortfolio()
      return
    }

    if (!loggedIn) {
      return
    }

    Alert.alert('Please add an ethereum addresss');
    this.props.goToAddressPage();
  }

  render = () => {
    const { portfolio } = this.props
    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header totalValue={portfolio.totalValue} />
        {/* NOTE: will be implemented in upcomign sprint
          <PriceChart />*/}
        <News />
        <TokenList tokens={portfolio.tokens} />
      </ScrollView>
    )
  }
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

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  addresses: state.account.addresses,
  loggedIn: !!state.account.token
})

const mapDispatchToProps = (dispatch) => ({
    goToAddressPage: () => dispatch(NavigationActions.navigate({ routeName: 'Accounts' })),
    login: () => dispatch(login()),
    register: () => dispatch(register()),
    getPortfolio: () => dispatch(getPortfolio())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
