import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';

import Header from '../Dashboard/Header';
import { formatPrice } from '../../helpers/functions'
import { getTokenDetails } from '../../reducers/account';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    display: 'flex',
    borderColor: '#fff',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    marginBottom: 10,
    flexDirection: 'row',
    paddingLeft: 20
  },
  containerChild: {
    marginBottom: 10,
    flexGrow: .5,
    flexBasis: 1
  },
  tokenHeading: {
    color: '#666'
  },
  tokenValue: {
    color: '#fff',
    fontSize: 30
  },
  header: {
    backgroundColor: '#000'
  },
  heading: {
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    color: '#fff',
    fontSize: 22,
    paddingBottom: 10,
    paddingLeft: 20,
    marginBottom: 10,
    marginTop: 10
  }
});

class TokenDetails extends Component {
  componentWillMount = async () => {
    const { getTokenDetails, symbol } = this.props
    await getTokenDetails(symbol)
  }

  render() {
    const { price, quantity, marketCap, volume24Hr, totalValue } = this.props.tokenDetails;

    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header totalValue={totalValue} />
        <Text style={styles.heading}>
          Token Info
        </Text>

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>PRICE</Text>
            <Text style={styles.tokenValue}>{'$'+formatPrice(price)}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>QUANTITY</Text>
            <Text style={styles.tokenValue}>{quantity}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>MARKET CAP</Text>
            <Text style={styles.tokenValue}>{marketCap}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>24 HR VOLUME</Text>
            <Text style={styles.tokenValue}>{volume24Hr}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getTokenDetails: (sym) => dispatch(getTokenDetails(sym))
})

const mapStateToProps = (state, props) => ({
  symbol: props.navigation.state.params.token.symbol,
  tokenDetails: state.account.tokenDetails
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TokenDetails));