import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  VictoryLine,
} from 'victory-chart-native';

import data from '../data';

const Dimensions = require('Dimensions');
const { width } = Dimensions.get('window');

class BasicLineChart extends Component {
  render() {
    const { ticks } = data;
    return (
      <ScrollView style={styles.container}>
        <VictoryLine
          data={ticks}
          x={(d) => d.time}
          y={'price'}
        />
      <View style={styles.timePeriods}>
        <View style={styles.timePeriodWrapper}>
          <Text style={styles.timePeriodLabel}>1D</Text>
        </View>
        <View style={[styles.timePeriodWrapper, {borderBottomWidth: 2, borderBottomColor: '#696969'}]}>
          <Text style={styles.timePeriodLabel}>1W</Text>
        </View>
        <View style={styles.timePeriodWrapper}>
          <Text style={styles.timePeriodLabel}>3M</Text>
        </View>
        <View style={styles.timePeriodWrapper}>
          <Text style={styles.timePeriodLabel}>1Y</Text>
        </View>
        <View style={styles.timePeriodWrapper}>
          <Text style={styles.timePeriodLabel}>ALL</Text>
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: width
  },
  timePeriods: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
  },
  timePeriodLabel: {
    color: '#fff',
    width: 50,
    textAlign: 'center',
  },
  timePeriodWrapper: {
    width: 50,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 5
  }
});

export default BasicLineChart;