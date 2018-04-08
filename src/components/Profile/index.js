import React, { Component } from 'react';
import { Image, Text, ScrollView, View, RefreshControl, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import Dashboard from '../Common/Dashboard'
import {
  getPortfolio,
  getPortfolioChart
} from '../../reducers/account';
import md5 from 'crypto-js/md5'
import Identicon from 'identicon.js/identicon'
import { baseAccent, brandColor } from '../../config'
import { trackRefresh } from '../../helpers/analytics'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 5
  },
  imageContainer: {
    flexDirection: 'row',
    flex: .4,
    justifyContent: 'center'
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  userMetadata: {
    flex: .60,
    marginLeft: 'auto'
  },
  username: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  userDescription: {
    color: '#fff',
    fontSize: 12
  },
  headerBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBtn: {
    flex: .5,
    paddingVertical: 10,
    marginHorizontal: 15,
    borderColor: brandColor,
    borderWidth: 1,
    borderRadius: 2
  },
  headerBtnText: {
    color: brandColor,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  metaContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#333',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 20
  },
  metaItem: {
    flex: .33,
    padding: 5,
    marginVertical: 5,
    alignItems: 'center'
  },
  metaLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  metaMid: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#333'
  },
  metaValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
})

const identicon = (str) => {
  const strHash = md5(str).toString();
  const data = new Identicon(strHash, {size: 150,margin:.3, background: [51,51,51,100]}).toString()
  return `data:image/png;base64,${data}`;
}

const ProfileHeader = ({username, reputation, followers, following, style}) => (
    <View>
      <View style={[styles.mainContainer, style||{}]}>
        <View style={styles.imageContainer}>
          <Image source={{uri: identicon(username)}} style={styles.image} />
        </View>

        <View style={styles.userMetadata}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.userDescription}>
            Cryptocurrency investor, advisor and evangelist. Let's make some magic internet money.
          </Text>
        </View>
    </View>

    <View style={styles.headerBtnContainer}>
      <TouchableHighlight  style={styles.headerBtn} onPress={()=>{}}>
        <View>
          <Text style={styles.headerBtnText}>Message</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.headerBtn} onPress={()=>{}}>
        <View>
          <Text style={styles.headerBtnText}>Follow</Text>
        </View>
      </TouchableHighlight>
    </View>

    <View style={styles.metaContainer}>
      <TouchableHighlight style={styles.metaItem}>
        <View>
          <Text style={styles.metaLabel}>
            REPUTATION
          </Text>
          <Text style={styles.metaValue}>
          {reputation}
          </Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight style={[styles.metaItem, styles.metaMid]}>
        <View>
          <Text style={styles.metaLabel}>
            FOLLOWERS
          </Text>
          <Text style={styles.metaValue}>
          {followers}
          </Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight style={styles.metaItem}>
        <View>
          <Text style={styles.metaLabel}>
            FOLLOWING
          </Text>
          <Text style={styles.metaValue}>
          {following}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  </View>
)

class Profile extends Component {

  static headerText = 'Portfolio'

  state = {
    refreshing: false
  }

  componentDidMount = async () => {
    await Promise.all([
      this.props.getPortfolio(true),
      this.props.getPortfolioChart()
    ])
  }

  onRefresh = async () => {
    this.setState({refreshing: true})
    await Promise.all([
      this.props.getPortfolio(false),
      this.props.getPortfolioChart()
    ])
    this.setState({refreshing: false})
    trackRefresh('Dashboard')
  }

  render() {
    const {
      navigation,
      portfolio,
      portfolioChart,
      username,
      reputation,
      following,
      followers
    } = this.props
    const { chartIsTouched } = this.state
    return (
      <ScrollView
        scrollEnabled={!chartIsTouched}
        style={{flex: 1}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
          <ProfileHeader
            style={{flex: .1}}
            reputation={reputation}
            username={username}
            followers={followers}
            following={following}
          />
          <Dashboard
            navigation={navigation}
            portfolio={portfolio}
            portfolioChart={portfolioChart}
            onChartTouch={(isTouched)=>{
              this.setState({
                chartIsTouched: isTouched
              })
            }}
          />
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => ({
  username: state.account.username,
  reputation: state.account.reputation,
  followers: state.account.followers,
  following: state.account.following,
  portfolio: state.account.portfolio,
  chartLoading: state.account.chartLoading,
  portfolioChart: state.account.portfolioChart,
  watchListSymbols: state.account.watchList,
  newsFeed: state.feed,
  stale: state.account.stale,
  period: '1d',
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    getPortfolio: (showUILoader) => dispatch(getPortfolio(showUILoader)),
    getPortfolioChart: () => dispatch(getPortfolioChart('1d')),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Profile));
