import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking, TouchableHighlight } from 'react-native';
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
  header: {
    marginBottom: 20
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
  linkContainer: {
    flexDirection: 'column'
  },
  linkContainerChild: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
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
  heading: {
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    color: '#fff',
    fontSize: 22,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  link: {
    color: '#fff',
    paddingLeft: 10
  }
});

class TokenDetails extends Component {
  componentDidMount() {
    const { navigation, getTokenDetails } = this.props
    const { token } = navigation.state.params

    if (!token.marketCap) {
      getTokenDetails(token.symbol)
    }
  }

  render() {
    const {
      price,
      balance,
      marketCap,
      volume24Hr,
      imageUrl,
      symbol,
      change,
      supply,
      priceChange,
      website,
      twitter,
      reddit
    } = this.props.token;
    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header
          style={styles.header}
          totalValue={balance ? (balance * price) : price}
          totalChange={priceChange}
          totalChangePct={change}
        />

        {!!balance && <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>PRICE</Text>
            <Text style={styles.tokenValue}>{'$'+formatPrice(price)}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>BALANCE</Text>
            <Text style={styles.tokenValue}>{balance.toLocaleString()}</Text>
          </View>
        </View>}

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>MARKET CAP</Text>
            <Text style={styles.tokenValue}>{'$'+formatPrice(marketCap)}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>24 HR VOLUME</Text>
            <Text style={styles.tokenValue}>{`$${formatPrice(volume24Hr)}`}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={[styles.containerChild, {flexGrow:1}]}>
            <Text style={styles.tokenHeading}>SUPPLY</Text>
            <Text style={styles.tokenValue}>{`${(supply||0).toLocaleString()} ${symbol}`}</Text>
          </View>
        </View>

        <View style={[styles.container, styles.linkContainer]}>
          {!!website && <View style={[styles.containerChild, styles.linkContainerChild]}>
              <MaterialCommunityIcons
                name="web"
                size={26}
                color="white"
                backgroundColor="black"
              />
              <TouchableHighlight
                onPress={()=>{
                  Linking.openURL(website).catch(
                    err => console.error('An error occurred', err));
                }}
              >
                <Text
                  style={styles.link}
                >
                  { website }
                </Text>
              </TouchableHighlight>
          </View>}
          {!!twitter && <View style={[styles.containerChild, styles.linkContainerChild]}>
              <MaterialCommunityIcons
                name="twitter"
                size={26}
                color="white"
                backgroundColor="black"
              />
              <TouchableHighlight
                onPress={()=>{
                  Linking.openURL(twitter).catch(
                    err => console.error('An error occurred', err));
                }}
              >
                <Text
                  style={styles.link}
                >
                  { twitter }
                </Text>
              </TouchableHighlight>
          </View>}
          {!!reddit && <View style={[styles.containerChild, styles.linkContainerChild]}>
              <MaterialCommunityIcons
                name="reddit"
                size={26}
                color="white"
                backgroundColor="black"
              />
              <TouchableHighlight
                onPress={()=>{
                  Linking.openURL(reddit).catch(
                    err => console.error('An error occurred', err));
                }}
              >
                <Text
                  style={styles.link}
                >
                  { reddit }
                </Text>
              </TouchableHighlight>
          </View>}
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
  token: {
    ...state.account.tokenDetails,
    ...props.navigation.state.params.token
  },
  tokenDetails: state.account.tokenDetails,
  portfolio: state.account.portfolio
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TokenDetails));