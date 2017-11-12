import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { formatPrice, formatCurrencyChange } from '../../helpers/functions'
import Header from '../Dashboard/Header';
import { getTokenDetails } from '../../reducers/account';
import { baseURL } from '../../config'

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
    color: '#666',
    fontFamily: 'Nunito'
  },
  tokenValue: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Nunito'
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
  }
});

class TokenDetails extends Component {
  componentWillMount = async () => {
    const { getTokenDetails, symbol } = this.props
    await getTokenDetails(symbol)
  }

  render() {
    const { price, quantity, marketCap, volume24Hr, totalValue, imageUrl, symbol, change, priceChange } = this.props.tokenDetails;

    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header totalValue={quantity ? totalValue : price} totalChange={priceChange} totalChangePct={change} />
        <View style={{paddingLeft: 20, flexDirection: 'row', alignItems: 'flex-start', marginVertical: 20}}>
          <Image source={{ uri: baseURL + imageUrl }} style={{width: 30, height: 30}}/>
          <Text style={[styles.heading, {alignSelf: 'flex-start', flex:1}]}>
            {symbol}
          </Text>
        </View>

        {!!quantity && <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>PRICE</Text>
            <Text style={styles.tokenValue}>{'$'+formatPrice(price)}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>QUANTITY</Text>
            <Text style={styles.tokenValue}>{quantity.toLocaleString()}</Text>
          </View>
        </View>}

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>MARKET CAP</Text>
            <Text style={styles.tokenValue}>{'$'+marketCap.toLocaleString()}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>24 HR VOLUME</Text>
            <Text style={styles.tokenValue}>{`$${volume24Hr.toLocaleString()}`}</Text>
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
  tokenDetails: state.account.tokenDetails,
  portfolio: state.account.portfolio
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TokenDetails));