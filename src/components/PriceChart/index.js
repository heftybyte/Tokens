import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  VictoryLine,
} from 'victory-chart-native';

import data from '../data';

class BasicLineChart extends Component {
  render() {
    const { ticks } = data;
    return (
      <View style={styles.container}>
        <VictoryLine
          height={200}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  timePeriods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000'
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
    paddingBottom: 2,
    backgroundColor: '#000'
  }
});

export default BasicLineChart;