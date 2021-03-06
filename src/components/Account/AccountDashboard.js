import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Animated, TouchableWithoutFeedback, StatusBar, Text, View } from 'react-native'
import { withDrawer } from '../../helpers/drawer'
import { SimpleLineIcons } from '@expo/vector-icons';
import { deleteAddress, refreshAddress, deleteWalletAddress } from '../../reducers/account';
import { baseAccent, baseColor, brandColor } from '../../config'
import Dashboard from '../Common/Dashboard'
import { Menu } from '../Common/Menu'
import {
  getPortfolio,
  getPortfolioChart
} from '../../reducers/account'
import { trackAddress, trackTap } from '../../helpers/analytics'

class AccountDashboard extends Component {

  static getHeader = (navState) => {
    const { id, name } = navState.params;
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10
      }}>
        <Text style={{color:'#fff', paddingRight: 10}}>
         {
            name ?
              name.substr(0, 11) + (name.length >= 10 ? '...' : '') :
              (`${id.substr(0, 5)}...${id.substr(39, 42)}`)
          }
        </Text> 
        <SimpleLineIcons name={'arrow-down'} color={'#fff'} />
      </View>  
    ) 
  }
  
  state = {
    menuHeight: new Animated.Value(1),
    menuOpen: false
  }

  updateHeader = () => {
    const { navigation } = this.props
    const { id, name } = navigation.state.params
    const { menuOpen } = this.state

    navigation.setParams({ overrideHeader:
      <TouchableWithoutFeedback onPress={this.toggleMenu} style={{width:'100%', height:40}}> 
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10
        }}>
          <Text style={{color:'#fff', paddingRight: 10}}>
          {
            name ?
              name.substr(0, 11) + (name.length >= 10 ? '...' : '') :
              (`${id.substr(0, 5)}...${id.substr(39, 42)}`)
          }
          </Text> 
          <SimpleLineIcons name={menuOpen ? 'arrow-up' : 'arrow-down'} color={'#fff'} />
        </View>
      </TouchableWithoutFeedback>
    })
  }

  componentWillMount = async () => {
    const { navigation } = this.props
    const { id: accountId, type } = navigation.state.params
    const { refreshAddress, deleteAddress, deleteWalletAddress } = this.props

    this.menuItems = [
      {
        name: "Refresh Balances",
        params: { platform: "ethereum" },
        icon: 'refresh',
        Component: SimpleLineIcons,
        route: "Select Account",
        onPress: ()=>{
          refreshAddress(accountId, type);
          trackAddress('Refresh', 'Button');
        }
      },
      {
        name: "Remove",
        params: { platform: "ethereum" },
        icon: 'close',
        Component: SimpleLineIcons,
        route: "Select Account",
        onPress: ()=>{
          if (type === 'address') {
            deleteAddress(accountId)
            trackAddress('Delete', 'Button');
          } else if (type === 'wallet') {
            deleteWalletAddress(accountId)
            trackAddress('Delete', 'Button');
          }
        }
      },
      {
        name: "Make Public",
        params: { platform: "ethereum" },
        icon: 'feed',
        Component: SimpleLineIcons,
        route: "Select Account"
      }
    ]

    this.updateHeader()
    await Promise.all([
      this.props.getPortfolio({ accountId, showUILoader: true, type }),
      this.props.getPortfolioChart({ accountId, type })
    ])
  }

  onRefresh = () => {
    const { navigation } = this.props
    const { id: accountId, type } = navigation.state.params
    return Promise.all([
      this.props.getPortfolio({ accountId, type, showUILoader: false }),
      this.props.getPortfolioChart({ accountId, type })
    ])
  }

  toggleMenu = () => {
    const { menuOpen, menuHeight } = this.state
    Animated.timing(
      menuHeight,
      {
        duration: 350,
        toValue: menuOpen ? 1 : this.menuItems.length * 75
      }
    ).start()
    this.setState({
      menuOpen: !menuOpen
    })
    this.updateHeader()
  }

  render() {
    const { navigation, portfolio, portfolioChart } = this.props
    const { id, type } = navigation.state.params
    const { menuHeight } = this.state

    return (
      <View style={{flex: 1}}>
        <View style={{zIndex: 1}}>
          <Animated.View style={{height: menuHeight, overflow: 'hidden'}}>
            <Menu
              onPress={this.toggleMenu}
              navigation={navigation}
              items={this.menuItems}
              baseColor={baseColor}
              brandColor={brandColor}
              baseAccent={baseAccent}
              style={{flex: 1}}
              listMargin={20}
            />
          </Animated.View>
        </View>
        <Dashboard
          id={id}
          type={type}
          navigation={this.props.navigation}
          portfolio={portfolio}
          portfolioChart={portfolioChart}
          onRefresh={this.onRefresh}
          onScroll={()=>{}}
        />
      </View>
    )
  }

}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio,
  chartLoading: state.account.chartLoading,
  portfolioChart: state.account.portfolioChart,
  newsFeed: state.feed,
  stale: state.account.stale,
  period: '1d',
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
    getPortfolio: ({accountId, type, showUILoader}) => dispatch(getPortfolio({accountId, type, showUILoader})),
    getPortfolioChart: ({accountId, type}) => dispatch(getPortfolioChart({accountId, type, period: '1d'})),
    deleteAddress: (address) => dispatch(deleteAddress(address)),
    deleteWalletAddress: (address) => dispatch(deleteWalletAddress(address)),
    refreshAddress: (address, type) => dispatch(refreshAddress(address, type)),
    showToast: (text) => dispatch(showToast(text)),
    fetchFeed: (timestamp) => dispatch(fetchFeed(timestamp)),
})


export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AccountDashboard));
