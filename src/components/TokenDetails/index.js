import React, { Component } from 'react';
import Dimensions from 'Dimensions';
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
import { update as _updateToken } from '../../reducers/token'
import portfolioPriceData from '../Chart/data'
import VideoPlayer from './player';

const window = Dimensions.get('window');
const viewWidth = window.width - 40;

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
    flexDirection: 'column',
    justifyContent: 'center'
  },
  linkContainerChild: {
    flexDirection: 'row',
    flex: 1
  },
  description: {
    flexDirection: 'column'
  },
  tokenHeading: {
    color: '#666',
    fontFamily: 'Nunito'
  },
  tokenValue: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Nunito',
  },
  tokenValueWrapped: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Nunito',
    width: 150
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
  videoCover: {
    width: viewWidth,
    height: viewWidth/(16/9),
    backgroundColor: '#000',
    position: 'absolute',
    zIndex: 99,
    color: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: .92
  },
  coverText: {
    color: '#dedede',
    fontSize: 20
  },
  video: {
    width: viewWidth,
    height: viewWidth/(16/9),
    backgroundColor: '#000'
  },
  externalLink: {
    marginRight: 20
  }
});

const tokenValueStyle = v => v.toString().length > 8 ? styles.tokenValueWrapped : styles.tokenValue

class TokenDetails extends Component {
  state = {
    readMore: false,
    refreshing: false,
    chartIsTouched: false,
    showVideoCover: true
  }

  componentDidMount() {
    const { navigation, getTokenDetails, getHistoricalPrices, updateToken } = this.props
    const { token } = navigation.state.params
    getHistoricalPrices({fsyms: token.symbol, tsyms: 'USD'})
    updateToken(token.price)
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
      isWatching,
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
        videoUrl
      },
      priceData,
      chartLoading,
      headerData,
      updateToken,
      period
    } = this.props;
    const { showVideoCover } = this.state;
    const maxDescDisplayLength = 180
    const { chartIsTouched } = this.state
    const displayPrice = chartIsTouched ? headerData.price : price
    return (
      <ScrollView
        scrollEnabled={!chartIsTouched}
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
          totalValue={displayPrice}
          timestamp={chartIsTouched && headerData.timestamp}
          totalChange={chartIsTouched && headerData.change_close || priceChange}
          totalChangePct={chartIsTouched && headerData.change_pct || change}
          period={period}
        />

        <Chart
          data={priceData}
          totalChangePct={change}
          loading={chartLoading}
          onCursorChange={(point)=>updateToken(point.y, point.x, point.change_pct, point.change_close)}
          onTouch={(isTouched)=>this.setState({chartIsTouched: isTouched})}
        />

        <RangeSelector
          style={{paddingBottom: 20}}
          onChange={()=>this.props.getHistoricalPrices({fsyms: symbol, tsyms: 'USD'})}
        />

        {!!balance && <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>BALANCE</Text>
            <Text style={tokenValueStyle(balance)}>{balance.toLocaleString()}</Text>
          </View>
        
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>HOLDINGS</Text>
            <Text style={tokenValueStyle(displayPrice*balance)}>{'$'+formatPrice(displayPrice*balance)}</Text>
          </View>
        </View>}

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>MARKET CAP</Text>
            <Text style={tokenValueStyle(marketCap)}>{'$'+formatPrice(marketCap)}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenHeading}>24 HR VOLUME</Text>
            <Text style={tokenValueStyle(volume24Hr)}>{`$${formatPrice(volume24Hr)}`}</Text>
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

        <View style={[styles.container, styles.description]}>
          {description ?<View style={[styles.containerChild, {flexGrow:1, paddingRight: 20}]}>
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
          </View>:null}
        </View>

        <View style={[styles.container, styles.linkContainer]}>
          <View style={{flexDirection: 'row'}}>
            {!!website && <TouchableHighlight
                  onPress={()=>{
                    Linking.openURL(website).catch(
                      err => console.error('An error occurred', err));
                  }}
                  style={styles.externalLink}
                >
                  <MaterialCommunityIcons
                    name="web"
                    size={30}
                    color="white"
                    backgroundColor="black"
                  />
                </TouchableHighlight>}
            {!!twitter && <TouchableHighlight
                  onPress={()=>{
                    Linking.openURL(twitter).catch(
                      err => console.error('An error occurred', err));
                  }}
                  style={styles.externalLink}
                >
                  <MaterialCommunityIcons
                    name="twitter"
                    size={30}
                    color="white"
                    backgroundColor="black"
                  />
                </TouchableHighlight>}
            {!!reddit && <TouchableHighlight
                  onPress={()=>{
                    Linking.openURL(reddit).catch(
                      err => console.error('An error occurred', err));
                  }}
                  style={styles.externalLink}
                >
                  <MaterialCommunityIcons
                    name="reddit"
                    size={30}
                    color="white"
                    backgroundColor="black"
                  />
                </TouchableHighlight>}
          </View>
        {!!videoUrl && <View style={[styles.container, {paddingLeft:0,paddingRight:20,paddingBottom:10, marginTop: 20}]}>
              {showVideoCover && <TouchableHighlight
                onPress={()=>this.setState({showVideoCover: false})}
                style={styles.videoCover}
              >
                {<MaterialCommunityIcons
                    name="play-circle"
                    size={60}
                    color="white"
                />}
              </TouchableHighlight>}
              <VideoPlayer
                  url={videoUrl}
                  style={styles.video}
              />
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
  removeFromWatchList: symbol => dispatch(removeFromWatchList(symbol)),
  updateToken: (price, timestamp, change_pct, change_close)=> dispatch(_updateToken({timestamp, price, change_pct, change_close}))
})

const mapStateToProps = (state, props) => {
  const token = {
    ...state.account.tokenDetails,
    ...props.navigation.state.params.token
  }
  const symbol = token.symbol
  const { watchListMap } = state.account
  const isWatching = watchListMap[symbol]
  const { chart } = state.ticker.historicalPrices
  const priceData = (chart[symbol] && chart[symbol]['USD'] || [])

  return {
    token,
    symbol,
    tokenDetails: state.account.tokenDetails,
    portfolio: state.account.portfolio,
    watchListMap,
    isWatching,
    priceData,
    chartLoading: state.ticker.historicalPrices.loading.chart,
    headerData: state.token,
    period: state.ticker.period
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TokenDetails));