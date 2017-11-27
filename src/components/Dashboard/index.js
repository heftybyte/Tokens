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
  RefreshControl
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';

import TokenList from '../TokenList';
import Header from './Header';
import News from '../NewsFeed';
import mockNewsFeed from '../NewsFeed/MockData'
import mockTokens from '../TokenList/data';
import mockWatchlist from '../TokenList/watchlist-data';
import {
  register,
  login,
  getPortfolio
} from '../../reducers/account';
import { showToast } from '../../reducers/ui';
import {fetchFeed} from '../../reducers/feed'
import { withDrawer } from '../../helpers/drawer';
import { trackRefresh } from '../../helpers/analytics'

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
    refreshing: false
  }

  componentWillMount = () => AsyncStorage.getItem('feed:latestTimestamp').then(
      (timestamp) => this.props.fetchFeed(timestamp)
);

  componentDidMount = async () => {
    if (this.state.stale) {
      this.props.getPortfolio()
      trackRefresh('Mount')
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
    await this.props.getPortfolio(false)
    this.setState({refreshing: false})
    trackRefresh('Manual')
  }

  render = () => {
    const { portfolio, goToAddressPage, loggedIn, addresses } = this.props
    return (
      <ScrollView
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
            totalValue={portfolio.totalValue}
            totalChange={portfolio.totalPriceChange}
            totalChangePct={portfolio.totalPriceChangePct}
          />
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
  addresses: state.account.addresses,
  loggedIn: !!state.account.token,
  newsFeed: state.feed,
  stale: state.account.stale,
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    goToAddressPage: () => dispatch(NavigationActions.navigate({ routeName: 'Add Address' })),
    login: () => dispatch(login()),
    register: () => dispatch(register()),
    getPortfolio: (showUILoader) => dispatch(getPortfolio(showUILoader)),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp))
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Dashboard));
