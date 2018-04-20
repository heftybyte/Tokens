import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from "react-native"
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import { hasWallet } from '../../helpers/wallet'
import { getExchangeImage, asyncFilter } from '../../helpers/functions'
import { baseAccent, baseColor, brandColor } from '../../config'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Menu } from '../Common/Menu'

const Icons = {
  'wallet': 'wallet',
  'address': 'notebook',
  'exchange_account': 'chart'
}

const AddScreens = {
  'address': 'Add Address',
  'wallet': 'New Wallet',
  'exchange_account': 'NewExchangeAccount'
}

const AccountSources = {
  'address': 'addresses',
  'wallet': 'wallets',
  'exchange_account': 'exchangeAccounts'
}

const AccountSourceId = {
  'address': 'blockchainId',
  'wallet': 'blockchainId',
  'exchange_account': 'exchangeId'
}

const styles = StyleSheet.create({
  header: {
      borderColor: baseAccent,
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingVertical: 10
  },
  heading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: brandColor
  },
  subHeading: {
      color: '#999',
      fontSize: 12,
      paddingVertical: 10
  },
  title: {
      fontSize: 36,
      color: brandColor
  }
})
class AccountPicker extends Component {
  state = {
    items: []
  }

  getAccounts = async (type, platformId) => {
    const stateField = AccountSources[type]
    const idField = AccountSourceId[type]
    let accounts = (this.props[stateField] || [])//.filter(acc=>acc[idField]===platformId)
    if (type === 'wallet') {
      console.log({accounts})
      accounts = await asyncFilter(accounts, async acc=>await hasWallet(acc.platform, acc.id))
      console.log({accounts})
    }
    return accounts
  }

  navigateToAddScreen = () => {
    const { navigation, goToRoute } = this.props
    const { type, platformId, platform, action } =  navigation.state.params
    const routeName = (platformId || platform) ? AddScreens[type] : 'AccountType'
    goToRoute(routeName, navigation.state.params)
  }

  navigateToRestoreWalletScreen = () => {
      const { navigation, goToRoute } = this.props
      goToRoute('Restore Wallet', navigation.state.params)
  }

  componentDidMount = () => {
    this.updateMenu(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    this.updateMenu({...this.props, ...(nextProps||{})})
  }

  updateMenu = async (props={}) => {
    const {
      navigation,
      addresses,
      goToRoute,
      exchangeMap
    } = props
    const {
      name,
      type,
      platformId,
      platform,
      action,
      contractAddress,
      currencyName,
      currencySymbol,
      image
    } =  navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const isTrade = action === 'buy' || action === 'sell'
    console.log({platformId})
    const accounts = await this.getAccounts(type, platformId)
    const items = (accounts||[]).map((acc)=>{
      const item = {
        name: acc.name || `${acc.id.substr(0, 20)}...${acc.id.substr(38,42)}`,
        params: { ...navigation.state.params, name: acc.name, id: acc.id },
        route: isTransaction ? 'SendTransaction' 
          : isTrade ? 'NewExchangeOrder' : 'Account View'
      }
      if (type === 'exchange_account') {
        const exchange = exchangeMap[acc.exchangeId]
        item.image =  getExchangeImage(exchange.name)
        item.params.exchangeName = exchange.name
        item.params.exchangeImage = exchange.image
      } else {
        item.icon = Icons[type]
        item.Component = SimpleLineIcons
      }
      return item
    })
    this.setState({
      items
    })
  }

  render() {
    const { navigation } = this.props
    const {
      name,
      type,
      platform,
      action
    } =  navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const isTrade = action === 'buy' || action === 'sell'
    const { items } = this.state

    return (
      <ScrollView style={{flex:1}}>
       {isTransaction && 
          <View style={styles.header}>
            <Text style={styles.heading}>Select Wallet</Text>
            <Text style={styles.subHeading}>Choose one of your {platform} wallets for this transaction.</Text>
          </View>
       }
      {isTrade && 
          <View style={styles.header}>
            <Text style={styles.heading}>Select Exchange</Text>
            <Text style={styles.subHeading}>Choose one of your linked {name} exchange accounts for this trade.</Text>

          </View>
       }
        <Menu
          navigation={navigation}
          items={items}
          baseColor={baseColor}
          brandColor={brandColor}
          baseAccent={baseAccent}
          style={{flex: 1}}
          listMargin={20}
        />
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}
            onPress={()=>this.navigateToAddScreen()}
          >
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <SimpleLineIcons style={{paddingRight: 10}} name={'plus'} color={brandColor} size={14} />
              <Text style={{ color: brandColor }}>new {type.replace('_', ' ')}</Text>
            </View>
          </TouchableHighlight>
      {
        (type !== 'exchange_account') &&
          <TouchableHighlight
             style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}
             onPress={()=>this.navigateToRestoreWalletScreen()}
          >
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <SimpleLineIcons style={{paddingRight: 10}} name={'cloud-upload'} color={brandColor} size={14} />
              <Text style={{ color: brandColor}}>import {type.replace('_', ' ')}</Text>
            </View>
          </TouchableHighlight>
      }
        </View>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => ({
  addresses: state.account.addresses,
  wallets: state.account.wallets,
  exchangeAccounts: state.account.exchangeAccounts,
  exchangeMap: state.exchanges.map
})

const mapDispatchToProps = (dispatch) => {
  return {
    goToRoute: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AccountPicker));
