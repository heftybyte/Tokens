import React, { PureComponent } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react'
import { NavigationActions } from 'react-navigation';

import PriceChart from '../PriceChart';
import TokenList from '../TokenList';
import Header from './Header';
import News from './News';
import mockTokens from '../../../mockTokens';

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

// @inject(
// 	stores => ({
// 		MainStore: stores.store.MainStore
// 	})
// )
@observer
export default class Dashboard extends PureComponent {
	// static navigationOptions = ({ navigation }) => ({
	// 	// the title  is also used as the label for the back button
	// 	title: `${navigation.state.price || 'Dashboard'}`,
	// 	headerStyle: styles.header,
	// 	headerLeft:(
	// 		<MaterialCommunityIcons
	// 			style={{paddingLeft:20}}
	// 			name="menu"
	// 			size={22}
	// 			color="white"
	// 			onPress={()=>{navigation.dispatch({type: 'Accounts'})}}
	// 		/>),
	// 	headerRight: <Ionicons onClick={()=>{}} style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
	// });


  // componentWillMount = async() =>{
  //   const { MainStore } = this.props
  //   console.log('setting up account')
  //   await MainStore.register()
  //   await MainStore.login()
  //   console.log('account setup')
  // }

  // componentWillReceiveProps = async (nextProps) => {
  //   const { MainStore, navigation: { navigate }} = nextProps

  //   if (addresses.length) {
  //     await MainStore.getPortfolio()
  //     return
  //   }

  //   if (!!MainStore.token) {
  //     return
  //   }
    
  //   Alert.alert('Please add an ethereum addresss');
  //   navigate('Accounts')
  // }

  render = () => {    
    const { MainStore } = this.props
    return (
			false &&
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header totalValue={MainStore.portfolio.totalValue} />
        {/* NOTE: will be implemented in upcomign sprint
          <PriceChart />*/}
        <News />
        <TokenList tokens={MainStore.portfolio.tokens} />
      </ScrollView>
    )
  }
}

