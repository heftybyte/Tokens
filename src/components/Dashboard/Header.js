import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import currencyFormatter from 'currency-formatter';
import { formatCurrencyChange } from '../../helpers/functions'
import { gainColor, lossColor } from '../../config'

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
    fontSize: 10,
    fontFamily: 'Nunito'
  },
  portfolioDeltaPeriod: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Nunito'
  },
  gain: {
    color: gainColor
  },
  loss: {
    color: lossColor
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
    const gain = (totalChangePct||0) > 0
    const valueParts = currencyFormatter
      .format((totalValue||0), currencyFormatOptions)
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
          {!!totalChange && 
            <View style={styles.changeContainer}>
              <Text style={[styles.portfolioDelta, gain ? styles.gain : styles.loss]}>
                  {formatCurrencyChange((totalChange||0))} ({(totalChangePct||0).toFixed(2)}%)
                  <Text style={styles.portfolioDeltaPeriod}> in 24h</Text>
              </Text>
            </View>
          }
      </View>
    );
  }
}

export default Header;
