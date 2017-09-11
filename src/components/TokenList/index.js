import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
} from 'react-native';

class ListItem extends Component {
    render() {
        const { item } = this.props
        return (
            <View style={styles.listItem}>
                <View style={styles.symbolContainer}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                </View>
                <View style={[styles.priceContainer, item.gain ? styles.gain : {}]}>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
            </View>
        )
    }
}

class TokenList extends Component {
  render() {
    const holdings = [
      {key:'a', symbol: 'ETH', price: '$290.13', gain: true},
      {key:'b', symbol: 'OMG', price: '$11.37', gain: false},
      {key:'c', symbol: 'TNT', price: '$0.118757', gain: false}
    ];

    const watching = [
      {key:'qtum', symbol: 'QTUM', price: '$12.73', gain: false},
      {key:'rep', symbol: 'REP', price: '$21.55', gain: true},
      {key:'zrx', symbol: 'ZRX', price: '$0.245106', gain: true}
    ]

    return (
        <SectionList
          style={styles.container}
          renderItem={({item}) => <ListItem item={item}/>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          sections={[ // homogenous rendering between sections
            {data: holdings, title: 'Holdings'},
            {data: watching, title: 'Watching'},
          ]}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: .1,
    alignSelf: 'stretch',
    backgroundColor: '#000',
  },
  symbol: {
    color: '#fff'
  },
  symbolContainer: {
    flex: .2,
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
    flex: 1,
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