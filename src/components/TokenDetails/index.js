import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Linking, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { formatPrice, formatCurrencyChange } from '../../helpers/functions'
import Chart from '../Chart/Chart';
import RangeSelector from '../Chart/RangeSelector';
import Header from '../Dashboard/Header';
import { getTokenDetails, addToWatchlist, removeFromWatchList } from '../../reducers/account';
import { baseURL, lossColor, brandColor } from '../../config'
import { getHistoricalPrices as _getHistoricalPrices } from '../../reducers/ticker'
import portfolioPriceData from '../Chart/data'

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
  },
  readmore: {
    color: '#6b2fe2',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Light'
  },
  priceContainer: {
    width: 96,
    height: 40,
    backgroundColor: lossColor,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 13
  },
  noPrice: {
    backgroundColor: '#000',
    borderColor: '#fff'
  },
  noPriceText: {
    color: '#fff'
  },
  watchText: {
    color: '#fff'
  },
  unwatchText: {
    color: brandColor
  },
  unwatchContainer: {
    borderColor: brandColor,
    paddingHorizontal: 8
  },
});

class TokenDetails extends Component {
  state = {
    readMore: false,
    refreshing: false
  }

  componentDidMount() {
    const { navigation, getTokenDetails, getHistoricalPrices } = this.props
    const { token } = navigation.state.params
    getHistoricalPrices({fsyms: token.symbol, tsyms: 'USD'})
    if (!token.marketCap) {
      getTokenDetails(token.symbol)
    }
  }

  _onRefresh = async () => {
    const {
      getTokenDetails,
      getHistoricalPrices,
      navigation: { state: { params: { token: { symbol } } } }
    } = this.props
    this.setState({refreshing: true})
    await Promise.all([
      getTokenDetails(symbol),
      getHistoricalPrices({fsyms: symbol, tsyms: 'USD'})
    ])
    this.setState({refreshing: false})
  }

  render() {
    const {
      addToWatchlist,
      removeFromWatchList,
      watchListMap,
      token: {
        price,
        balance,
        marketCap,
        volume24Hr,
        symbol,
        change,
        change7d,
        supply,
        priceChange,
        priceChange7d,
        website,
        twitter,
        reddit,
        description,
      },
      chartData,
      chartLoading
    } = this.props;
    const isWatching = watchListMap[symbol]
    const maxDescDisplayLength = 180
    const priceData = (chartData && chartData[symbol] && chartData[symbol]['USD'] || []).slice(0,1440)
    return (
      <ScrollView
        style={styles.scrollContainer}
        containerStyleContent={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <Header
          style={styles.header}
          totalValue={price}
          totalChange={priceChange}
          totalChangePct={change}
        />

        <Chart data={priceData} totalChangePct={change} loading={chartLoading} />
        <RangeSelector
          style={{paddingBottom: 20}}
          onChange={()=>this.props.getHistoricalPrices({fsyms: symbol, tsyms: 'USD'})}
        />

        {!!balance && <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>BALANCE</Text>
            <Text style={styles.tokenValue}>{balance.toLocaleString()}</Text>
          </View>
        
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>HOLDINGS</Text>
            <Text style={styles.tokenValue}>{'$'+formatPrice(price*balance)}</Text>
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

        <View style={[styles.container, {marginTop: 10}]}>
          <View style={[styles.containerChild, {flexGrow:1, alignItems: 'center'},]}>
            <TouchableOpacity
              onPress={() => isWatching ? removeFromWatchList(symbol) : addToWatchlist(symbol) }
              style={[
                  styles.priceContainer,
                  styles.noPrice,
                  isWatching ? styles.unwatchContainer : {}
              ]}
            >
              {
                isWatching ?
                <Text style={[styles.unwatchText]}>UNWATCH</Text>
                  :
                <Text style={[styles.watchText]}>WATCH</Text>
              }

            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container, styles.linkContainer]}>
          <View style={[styles.containerChild, {flexGrow:1, paddingRight: 20}]}>
              <Text style={styles.tokenHeading}>DESCRIPTION</Text>
              <Text
                numberOfLines={this.state.readMore ? 0 : 4}
                style={[styles.tokenValue, {fontSize: 15,textAlign: 'justify', paddingTop: 5}]}>
                  {description}
                  </Text>
                {description.length > maxDescDisplayLength && (<TouchableHighlight
                    onPress={() => this.setState({readMore: !this.state.readMore})}
                    style={{marginTop: 7}}>
                  <Text
                      style={styles.readmore}
                  >
                      { this.state.readMore?'Close':'Read more' }
                  </Text>
                </TouchableHighlight>)
                }
          </View>
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
  getTokenDetails: (sym) => dispatch(getTokenDetails(sym)),
  getHistoricalPrices: ({fsyms,tsyms,format='chart',start,end,period}) =>
    dispatch(_getHistoricalPrices({fsyms,tsyms,format,start,end,period})),
  addToWatchlist: symbol => dispatch(addToWatchlist(symbol)),
  removeFromWatchList: symbol => dispatch(removeFromWatchList(symbol))
})

const mapStateToProps = (state, props) => ({
  symbol: props.navigation.state.params.token.symbol,
  token: {
    ...state.account.tokenDetails,
    ...props.navigation.state.params.token
  },
  tokenDetails: state.account.tokenDetails,
  portfolio: state.account.portfolio,
  watchListMap: state.account.watchListMap,
  chartData: state.ticker.historicalPrices.chart,
  chartLoading: state.ticker.historicalPrices.loading.chart
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TokenDetails));