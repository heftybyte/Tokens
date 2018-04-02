import React, { Component }  from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import currencyFormatter from 'currency-formatter';
import { formatPrice, formatCurrencyChange } from '../../helpers/functions'
import { gainColor, lossColor } from '../../config'
import moment from 'moment'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    alignItems: 'center'
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

const datePeriodOptions = {
  'mddyyyy': {month:'short',day:'numeric',year:'numeric'},
  'hhm': {hour: 'numeric', minute: 'numeric'},
  'mddyyyyhhm': {
    month:'short',
    day:'numeric',
    year:'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }
}
const formatDate = (d, period) => {
  switch(period) {
    case '1d':
      const now = new Date()
      const dateStr = moment(d).format('h:mm a')
      let suffix = 'Today'
      if (d.getDate() < now.getDate()) {
        suffix = 'Yesterday'
      }
      return dateStr + ' ' + suffix
      break;
    case '1w':
      return moment(d).format('h:mm a MMM Do')
      break;
    default:
      return moment(d).format('MMM Do, YYYY')
  }
}

class Header extends Component {

  render () {
    const { totalValue = 0, totalChange, totalChangePct, style=[], timestamp, period } = this.props
    const gain = (totalChangePct||0) > 0
    const valueParts = formatPrice(totalValue).split(/\$|\./)
    const smallerFont = valueParts[0].length >= 7 ?
      styles.smallHeaderFont : {}
    const formattedDate = timestamp ? formatDate(new Date(timestamp), period) : 'last 24hrs'
    return (
      <Animated.View style={[styles.container, ...style]}>
        <Text>
          <Text style={styles.portfolioValueCurrencySymbol}>$</Text>
          <Text style={[styles.portfolioValue, smallerFont]}>{valueParts[0]}</Text>
          <Text style={styles.portfolioValueCents}>.{valueParts[1]||'00'}</Text>
        </Text>
          {!!totalChange &&
            <View style={styles.changeContainer}>
              <Text style={[styles.portfolioDelta, gain ? styles.gain : styles.loss]}>
                  {formatCurrencyChange((totalChange||0))} ({(totalChangePct||0).toFixed(2)}%)
                  <Text style={styles.portfolioDeltaPeriod}>{ ' ' + formattedDate }</Text>
              </Text>
            </View>
          }
      </Animated.View>
    );
  }
}

export default Header;
