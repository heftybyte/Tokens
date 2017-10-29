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
    fontFamily: 'Nunito-ExtraLight'
  },
  portfolioValue: {
    color: '#fff',
    fontSize: 60,
    fontFamily: 'Nunito-ExtraLight'
  },
  portfolioValueCents: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Nunito-ExtraLight'
  },
  changeContainer: {
    paddingBottom: 10
  },
  portfolioDelta: {
    color: '#fff',
    fontSize: 15
  },
  portfolioDeltaPeriod: {
    fontSize: 15,
    color: '#c1c0bf'
  },
  gain: {
    color: '#6b2fe2'
  },
  loss: {
    color: '#b63e15'
  },
  smallHeaderFont: {
    fontSize: 50
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
    const { totalValue, totalChange, totalChangePct, style } = this.props
    const gain = totalChange >= 0
    const valueParts = currencyFormatter
      .format(totalValue, currencyFormatOptions)
      .split(/\$|\./)
    const smallerFont = valueParts[1].length >= 7 ?
      styles.smallHeaderFont :
      {}

    return (
      <View style={[styles.container, style || {}]}>
        <Text>
          <Text style={styles.portfolioValueCurrencySymbol}>$</Text>
          <Text style={[styles.portfolioValue, smallerFont]}>{valueParts[1]}</Text>
          <Text style={styles.portfolioValueCents}>.{valueParts[2]||'00'}</Text>
        </Text>
        <Text style={styles.changeContainer}>
        {/* NOTE: will be implemented in the next sprint
          <Text style={[styles.portfolioDelta, gain ? styles.gain : styles.loss]}>
            {gain ? '+' : '-'} {totalChange}({totalChangePct}%)
          </Text>
          <Text style={styles.portfolioDeltaPeriod}>24h</Text>
        */}
        </Text>
      </View>
    );
  }
}

export default Header;
