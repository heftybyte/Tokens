import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image
} from 'react-native';

const baseURL = process.env.NODE_ENV === 'production' ?
  'https://erc-20.io' :
  'http://192.168.86.22:3000'

const formatPrice = (price) => {
  let [whole, decimal] = String(price).split('.')
  if (whole === '0') {
    return decimal
  }
  if (!decimal || Number.isNaN(decimal) || decimal === 'NaN') {
    decimal = '.00'
  } else {
    decimal = '.' + decimal.substr(0,2)
    if (decimal.length < 3) {
      decimal += '0'
    }
  }
  return Number(whole + decimal).toLocaleString()
}

const TokenItem = ({item, index}) => (
  <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
    <View>
      <Image source={{ uri: baseURL + item.imageUrl }} style={{width: 30, height: 30}} />
    </View>

    <View style={styles.symbolContainer}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.balance}>{item.balance}</Text>
    </View>
    <View style={[styles.priceContainer, parseInt(item.change) > -1 ? styles.gain : {}]}>
      <Text style={styles.price}>${formatPrice(item.balance * item.price)}</Text>
    </View>
  </View>
);

class TokenList extends Component {

  render() {
    let dataTokens = this.props.tokens || []

    dataTokens = dataTokens.map(tokenObj => (
      {
        ...tokenObj,
        key: tokenObj.symbol
      }
    ))

    return (
      <View>
        <SectionList
          style={styles.container}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          sections={[
            {data: dataTokens, title: 'Holdings', renderItem: ({item, index}) => <TokenItem item={item} index={index}/>},
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: '#000'
  },
  symbol: {
    color: '#fff',
    fontSize: 16
  },
  balance: {
    color: '#333',
    fontSize: 12
  },
  symbolContainer: {
    flex: .6,
  },
  priceContainer: {
    flex: .2,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  price: {
    color: '#000',
    textAlign: 'center',
    width: 85
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: '#111',
    borderTopWidth: 1
  },
  noBorderTop: {
    borderTopWidth: 0
  },
  sectionHeader: {
    color: "#fff",
    backgroundColor: '#17191c',
    padding: 10
  },
  gain: {
    backgroundColor: '#1bcca4',
    borderColor: '#1bcca4'
  }
});

export default TokenList;