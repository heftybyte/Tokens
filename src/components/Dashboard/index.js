import React, { Component } from 'react';
import currencyFormatter from 'currency-formatter';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight,
  AsyncStorage,
  Alert,
  StatusBar,
  Button,
  RefreshControl,
  Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';

import TokenList from '../TokenList';
import Header from './Header';
import News from '../NewsFeed';
import Chart from '../Chart/Chart';
import RangeSelector from '../Chart/RangeSelector';
import mockNewsFeed from '../NewsFeed/MockData'
import mockTokens from '../TokenList/data';
import mockWatchlist from '../TokenList/watchlist-data';
import {
  register,
  login,
  getPortfolio,
  getPortfolioChart,
  getTokenDetails
} from '../../reducers/account';
import { showToast } from '../../reducers/ui';
import {fetchFeed} from '../../reducers/feed'
import { withDrawer } from '../../helpers/drawer'
import { getTokenDetailsForAccount } from '../../helpers/api'
import { trackRefresh } from '../../helpers/analytics'
import { update as _updateToken } from '../../reducers/token'
import portfolioPriceData from '../Chart/data'
import { Constants } from 'expo';

const qs = require('qs');

const currencyFormatOptions =  {
  code: 'USD',
  thousandsSeparator: ',',
  decimalSeparator: '.',
  symbolOnLeft: true,
  spaceBetweenAmountAndSymbol: false,
  decimalDigits: 2
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000'
  },
  header: {
    backgroundColor: '#f00',
    height: 80,
  },
  addBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6b2fe2',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20
  },
  addBtnText: {
    textAlign: 'center',
    color: '#fff'
  },
  addBtnIcon: {
    marginRight: 10
  },
  gain: {
    color: '#6b2fe2'
  },
  loss: {
    color: '#b63e15'
  }
});

class Dashboard extends Component {
  state = {
    refreshing: false,
    chartIsTouched: false
  }

  componentWillMount = () => AsyncStorage.getItem('feed:latestTimestamp').then(
      (timestamp) => this.props.fetchFeed(timestamp)
  );

  componentDidMount = async () => {
    Linking.addEventListener('url', this.handleDeepLink);
    if (this.state.stale) {
      this.props.getPortfolio()
      this.props.getPortfolioChart()
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleDeepLink);
  }

  handleDeepLink = async (event) => { 
    let queryString = event.url.replace(Constants.linkingUri, '')
    if (queryString) {
      var data = qs.parse(queryString)
      let item  =  await this.props.getTokenDetails(data.symbol)
      console.log(item)
      this.props.goToTokenDetailsPage(item);
    }
  }

  handleScroll = (event) => {
    const hiddenHeight = event.nativeEvent.contentOffset.y;
    const { setParams } = this.props.navigation;
    const { totalValue } = this.props.portfolio;

    if (hiddenHeight >= 70 && totalValue) {

      const valueParts = currencyFormatter
      .format(totalValue, currencyFormatOptions)
      .split(/\$|\./);

      const valueString = `\$${valueParts[0]}${valueParts[1]}.${valueParts[2]||'00'}`;

      setParams && setParams({ overrideHeaderText: valueString });
    } else {
      setParams && setParams({ overrideHeaderText: null });
    }
  }

  _onRefresh = async () => {
    this.setState({refreshing: true})
    await Promise.all([
      this.props.getPortfolio(false),
      this.props.getPortfolioChart()
    ])
    this.setState({refreshing: false})
    trackRefresh('Dashboard')
  }

  render = () => {
    const {
      portfolio,
      portfolioChart,
      chartLoading,
      goToAddressPage,
      loggedIn,
      addresses,
      updateToken,
      headerData,
      period
    } = this.props
    const { chartIsTouched } = this.state
    const displayPrice = chartIsTouched ? headerData.price : portfolio.totalValue
    return (
      <ScrollView
        scrollEnabled={!chartIsTouched}
        style={styles.scrollContainer}
        containerStyleContent={styles.container}
        onScroll={this.handleScroll}
        onScrollEndDrag={this.handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <StatusBar
          backgroundColor="#000"
          barStyle="light-content"
        />
        { !addresses.length  ?
          <TouchableHighlight
            onPress={()=>{goToAddressPage({type: 'Accounts'})}}
          >
            <View style={styles.addBtn}>
              <MaterialCommunityIcons
                style={styles.addBtnIcon}
                name="plus-circle-outline"
                size={22}
                color="white"
              />
              <Text style={styles.addBtnText}>Add Your Ethereum Address</Text>
            </View>
          </TouchableHighlight>
        : <Header
            totalValue={displayPrice}
            timestamp={chartIsTouched && headerData.timestamp}
            totalChange={chartIsTouched && headerData.change_close || portfolio.totalPriceChange}
            totalChangePct={chartIsTouched && headerData.change_pct || portfolio.totalPriceChangePct}
            period={period}
          />
        }

        { !!addresses.length && 
          <Chart
            data={portfolioChart}
            totalChangePct={portfolio.totalPriceChangePct}
            onCursorChange={(point)=>updateToken(point.y, point.x, point.change_pct, point.change_close)}
            loading={chartLoading}
            onTouch={(isTouched)=>this.setState({chartIsTouched: isTouched})}
          />
        }
        { !! addresses.length && 
          <RangeSelector onChange={this.props.getPortfolioChart} />
        }
        
        <News feed={this.props.newsFeed} />
        { !!portfolio.tokens.length &&
        <TokenList tokens={portfolio.tokens} />}
        { !!portfolio.watchList.length &&
        <TokenList
            title="Watchlist"
            tokens={portfolio.watchList}
            type="watchList"
          />}
        { !!portfolio.top.length &&
        <TokenList
          title="Top 100 Tokens By Market Cap" 
          tokens={portfolio.top}
          type="watchList"
        />}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  chartLoading: state.account.chartLoading,
  portfolioChart: state.account.portfolioChart,
  addresses: state.account.addresses,
  loggedIn: !!state.account.token,
  newsFeed: state.feed,
  stale: state.account.stale,
  headerData: state.token,
  period: state.ticker.period,
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    goToAddressPage: () => dispatch(NavigationActions.navigate({ routeName: 'Add Address' })),
    login: () => dispatch(login()),
    register: () => dispatch(register()),
    getPortfolio: (showUILoader) => dispatch(getPortfolio(showUILoader)),
    getPortfolioChart: () => dispatch(getPortfolioChart()),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
    updateToken: (price, timestamp, change_pct, change_close)=> dispatch(_updateToken({timestamp, price, change_pct, change_close})),
    getTokenDetails: (sym) => dispatch(getTokenDetails(sym)),
    goToTokenDetailsPage: (token) => dispatch(NavigationActions.navigate({ routeName: 'Token Details', params: {token} }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Dashboard));
