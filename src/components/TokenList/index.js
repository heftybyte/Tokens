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

const TokenItem = ({item}) => (
  <View style={styles.listItem}>
    <View>
      <Image source={{ uri: baseURL + item.imageUrl}} style={{width: 25, height: 25}} />
    </View>

    <View style={styles.symbolContainer}>
      <Text style={styles.symbol}>{item.symbol}</Text>
    </View>
    <View style={[styles.priceContainer, parseInt(item.change) > -1 ? styles.gain : {}]}>
      <Text>${(item.balance * item.price).toPrecision(6)}</Text>
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
            {data: dataTokens, title: 'Holdings', renderItem: ({item}) => <TokenItem item={item}/>},
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
    color: '#fff'
  },
  symbolContainer: {
    flex: .6,
  },
  priceContainer: {
    flex: .2,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  price: {
    color: '#000',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10
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