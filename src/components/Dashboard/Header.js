import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import currencyFormatter from 'currency-formatter';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
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

const currencyFormatOptions =  {
  code: 'USD',
  thousandsSeparator: ',',
  decimalSeparator: '.',
  symbolOnLeft: true,
  spaceBetweenAmountAndSymbol: false,
  decimalDigits: 2
};

class Header extends Component {

  render () {
    const { totalValue } = this.props
    const valueParts = currencyFormatter
      .format(totalValue, currencyFormatOptions)
      .split(/\$|\./)
    return (
      <View style={styles.container}>
        <Text>
          <Text style={styles.portfolioValueCurrencySymbol}>$</Text>
          <Text style={styles.portfolioValue}>{valueParts[1]}</Text>
          <Text style={styles.portfolioValueCents}>.{valueParts[2]||'00'}</Text>
        </Text>
        <Text>
          <Text style={[styles.portfolioDelta, styles.gain]}>+23.32(1.15%)</Text>
          <Text style={styles.portfolioDeltaPeriod}>TODAY</Text>
        </Text>
      </View>
    );
  }
}

export default Header;