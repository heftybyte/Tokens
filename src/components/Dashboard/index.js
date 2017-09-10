import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import PriceChart from '../PriceChart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  <View style={styles.container}>
    <Text>
      <Text style={styles.portfolioValueCurrencySymbol}>$</Text>
      <Text style={styles.portfolioValue}>10,000</Text>
      <Text style={styles.portfolioValueCents}>.39</Text>
    </Text>
    <Text>
      <Text style={[styles.portfolioDelta, styles.gain]}>+23.32(1.15%)</Text>
      <Text style={styles.portfolioDeltaPeriod}>TODAY</Text>
    </Text>
    <PriceChart />
    <Text>Hello</Text>
  </View>
);

Dashboard.navigationOptions = {
  // headerLeft: <Button title="Account" />,
  // headerRight: <Button title="Search" />,
  headerStyle: styles.header
};

export default Dashboard;
