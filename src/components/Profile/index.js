import React, { Component } from 'react';
import { Image, Text, ScrollView, View, RefreshControl, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import Dashboard from '../Common/Dashboard'
import {
  getPortfolio,
  getPortfolioChart
} from '../../reducers/account';
import { baseAccent, brandColor } from '../../config'
import { trackRefresh } from '../../helpers/analytics'
import { logger } from '../../helpers/api'
import { identicon } from '../../helpers/functions'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 5
  },
  imageContainer: {
    flex: .3,
    justifyContent: 'center',
  },
  image: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    borderRadius: 45
  },
  userMetadata: {
    flex: .7,
    paddingLeft: 10
  },
  username: {
    color: '#fff',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  userDescription: {
    color: '#fff',
    fontSize: 12
  },
  userDescriptionContainer: {
    marginHorizontal: 30,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: baseAccent
  },
  headerBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  headerBtn: {
    flex: .5,
    justifyContent: 'center',
    paddingVertical: 5,
    marginHorizontal: 5,
    borderColor: brandColor,
    borderWidth: 1,
    borderRadius: 2,
    height: 30
  },
  headerBtnText: {
    color: brandColor,
    fontSize: 10,
    textAlign: 'center'
  },
  metaContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  metaItem: {
    flex: .33,
    height: 50,
    padding: 5,
    marginVertical: 5,
    alignItems: 'center'
  },
  metaLabel: {
    color: '#fff',
    fontSize: 8
  },
  metaMid: {
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: "#444"
  },
  metaValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
})

const ProfileHeader = ({username, description, reputation, followers, following, style}) => (
    <View>
      <View style={[styles.mainContainer, style||{}]}>
        <View style={styles.imageContainer}>
          <Image source={{uri: identicon(username)}} style={styles.image} />
        </View>

        <View style={styles.userMetadata}>
          <View style={styles.metaContainer}>
            <TouchableHighlight style={styles.metaItem}>
              <View>
                <Text style={styles.metaValue}>
                {reputation}
                </Text>
                <Text style={styles.metaLabel}>
                  REPUTATION
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.metaItem, styles.metaMid]}>
              <View>
                <Text style={styles.metaValue}>
                {followers}
                </Text>
                <Text style={styles.metaLabel}>
                  FOLLOWERS
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight style={styles.metaItem}>
              <View>
                <Text style={styles.metaValue}>
                {following}
                </Text>
                <Text style={styles.metaLabel}>
                  FOLLOWING
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.headerBtnContainer}>
            <TouchableHighlight  style={styles.headerBtn} onPress={()=>{}}>
                <Text style={styles.headerBtnText}>Message</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.headerBtn} onPress={()=>{}}>
                <Text style={styles.headerBtnText}>Follow</Text>
            </TouchableHighlight>
          </View>
        </View>
    </View>

    <View style={styles.userDescriptionContainer}>
      <Text style={styles.username}>@{username}</Text>
      {!!description &&
        <Text style={styles.userDescription}>
          {description}
        </Text>}
    </View>
  </View>
)

class Profile extends Component {

  static headerText = 'Home'

  state = {
    refreshing: false
  }

  componentDidMount = async () => {
    const { navigation } = this.props
    logger.info('Profile mounted')
    await Promise.all([
      this.props.getPortfolio({ showUILoader: true }),
      this.props.getPortfolioChart()
    ])
  }

  onRefresh = async () => {
    this.setState({refreshing: true})
    await Promise.all([
      this.props.getPortfolio({ showUILoader: false }),
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
      description,
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
            description={description}
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
  description: state.account.description,
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
    getPortfolio: ({showUILoader}) => dispatch(getPortfolio({showUILoader})),
    getPortfolioChart: () => dispatch(getPortfolioChart({period: '1d'})),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Profile));
