import React from 'react';
import { StyleSheet, Text, ScrollView, View, Button, TouchableHighlight } from 'react-native';
import PriceChart from '../PriceChart';
import TokenList from '../TokenList';
import Header from './Header';
import News from './News';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    flex: 1,
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

const Dashboard = () => (
  <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
    <Header totalValue={'10,000.39'} />
    <PriceChart />
    <News />
    <TokenList />
  </ScrollView>
);

Dashboard.navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.price}`,
  headerStyle: styles.header,
  headerLeft:(
        <MaterialCommunityIcons 
          style={{paddingLeft:20}} 
          name="menu" 
          size={22} 
          color="white"
          onPress={()=>{alert('press');navigation.dispatch({type: 'Account'})}}
        />),
  headerRight: <Ionicons onClick={()=>{console.log('hi')}} style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
})

export default Dashboard;
