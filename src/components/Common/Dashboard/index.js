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
  Button,
  RefreshControl
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';

import TokenList from '../../TokenList';
import Header from './Header';
import News from '../../NewsFeed';
import Chart from '../../Chart/Chart';
import RangeSelector from '../../Chart/RangeSelector';
import {
  getPortfolio,
  getPortfolioChart,
  getTokenDetails
} from '../../../reducers/account';
import { showToast } from '../../../reducers/ui';
import {fetchFeed} from '../../../reducers/feed'
import { trackRefresh, trackTap } from '../../../helpers/analytics'
import { baseColor, lossColor, brandColor } from '../../../config'

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
    backgroundColor: baseColor
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: baseColor
  },
  header: {
    backgroundColor: baseColor,
    height: 80,
  },
  addBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandColor,
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
    color: brandColor
  },
  loss: {
    color: '#b63e15'
  }
});

class Dashboard extends Component {
  state = {
    refreshing: false,
    chartIsTouched: false,
    displayPrice: 0,
    portfolioTimestamp: 0,
    totalPriceChange: 0,
    totalPriceChangePct: 0
  }

  componentWillMount = async () => {
    this.props.fetchFeed()
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
    if (this.props.onRefresh) {
      await this.props.onRefresh()
    }
    this.setState({refreshing: false})
    trackRefresh('Dashboard')
  }

  render = () => {
    const {
      id,
      type,
      portfolio,
      portfolioChart,
      chartLoading,
      goToAddressPage,
      goToSearchPage,
      addresses,
      updateToken,
      period,
      watchListSymbols,
      onScroll,
      onChartTouch
    } = this.props
    const { chartIsTouched, portfolioTimestamp, totalPriceChange, totalPriceChangePct } = this.state
    const displayPrice = chartIsTouched ? this.state.displayPrice : portfolio.totalValue

    return (
      <ScrollView
        scrollEnabled={!chartIsTouched}
        style={styles.scrollContainer}
        containerStyleContent={styles.container}
        onScroll={onScroll || this.handleScroll}
        onScrollEndDrag={onScroll || this.handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
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
            timestamp={chartIsTouched && portfolioTimestamp}
            totalChange={chartIsTouched && totalPriceChange || portfolio.totalPriceChange}
            totalChangePct={chartIsTouched && totalPriceChangePct || portfolio.totalPriceChangePct}
            period={period}
          />
        }

        { !!addresses.length &&
          <Chart
            data={portfolioChart}
            totalChangePct={portfolio.totalPriceChangePct}
            onCursorChange={(point)=>{
              this.setState({
                displayPrice: point.y,
                portfolioTimestamp: point.x,
                totalPriceChange: point.change_close,
                totalPriceChangePct: point.change_pct,
              })
            }}
            loading={chartLoading}
            onTouch={(isTouched)=>{
              this.setState({chartIsTouched: isTouched})
              onChartTouch && onChartTouch(isTouched)
            }}
          />
        }
        {/* !! addresses.length &&
          <RangeSelector onChange={this.props.getPortfolioChart} />
        */}

        <News feed={this.props.newsFeed} />
        { !!portfolio.tokens.length &&
        <TokenList tokens={portfolio.tokens} />}
        <View>
          <TokenList
            title="Watchlist"
            tokens={portfolio.watchList}
            type="watchList"
          />
          {!watchListSymbols.length &&
            <TouchableHighlight
              style={{marginBottom: 20, marginTop: -20}}
              onPress={()=>{trackTap('Search');goToSearchPage()}}
            >
              <View style={styles.addBtn}>
                <MaterialCommunityIcons
                  style={styles.addBtnIcon}
                  name="plus-circle-outline"
                  size={22}
                  color="white"
                />
                <Text style={styles.addBtnText}>Add Tokens to Your Watchlist</Text>
              </View>
            </TouchableHighlight>}
        </View>
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
  watchListSymbols: state.account.watchList,
  newsFeed: state.feed,
  stale: state.account.stale,
  period: '1d',
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    goToAddressPage: () => dispatch(NavigationActions.navigate({ routeName: 'Add Address' })),
    goToSearchPage: () => dispatch(NavigationActions.navigate({ routeName: 'Search' })),
    getPortfolio: (showUILoader) => dispatch(getPortfolio(showUILoader)),
    getPortfolioChart: () => dispatch(getPortfolioChart('1d')),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
    getTokenDetails: (sym) => dispatch(getTokenDetails(sym)),
    goToTokenDetailsPage: (token) => dispatch(NavigationActions.navigate({ routeName: 'Token Details', params: {token} }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
