import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from "react-native"
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from "lodash";
import { withDrawer } from '../../helpers/drawer'
import { hasWalletOnDisk } from '../../helpers/wallet'
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

const AccountTypeHeader = {
  'address': 'Addresses',
  'wallet': 'Wallets',
  'exchange_account': 'Exchange Accounts'
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

const populateOnDisk = async (acc) =>
  ({...acc, onDisk: await hasWalletOnDisk(acc.platform, acc.id) })

class AccountPicker extends Component {

  static getHeaderText = (navState) => {
    const { type, platform } = navState.params
    return `${_.capitalize(platform)} ${AccountTypeHeader[type]}`
  }

  state = {
    items: [],
    heading: '',
    subHeading: ''
  }

  getAccounts = async (type, platform) => {
    const stateField = AccountSources[type]
    const idField = AccountSourceId[type]
    let accounts = (this.props[stateField] || []).filter(a=>a.platform===platform)
    if (type === 'wallet') {
      const mappers = accounts.map((acc)=>populateOnDisk(acc))
      accounts = await Promise.all(mappers)
    }
    return accounts
  }

  navigateToAddScreen = () => {
    const { navigation, goToRoute } = this.props
    const { type, platform, action } = navigation.state.params
    const routeName = platform ? AddScreens[type] : 'AccountType'
    goToRoute(routeName, navigation.state.params)
  }

  navigateToRestoreWalletScreen = () => {
      const { navigation, goToRoute } = this.props
      goToRoute('Restore Wallet', navigation.state.params)
  }

  componentDidMount = () => {
    this.updateMenu(this.props)
    this.updateHeader()
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
      platform,
      action,
      contractAddress,
      currencyName,
      currencySymbol,
      image
    } = navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const isTrade = action === 'buy' || action === 'sell'

    try {
      const accounts = await this.getAccounts(type, platform)
      const items = (accounts||[]).map((acc)=>{
        const item = {
          name: acc.name || `${acc.id.substr(0, 20)}...${acc.id.substr(38,42)}`,
          params: { 
            ...navigation.state.params,
            name: acc.name,
            id: acc.id,
            platform
          },
          route: isTransaction ? 'SendTransaction' 
            : isTrade ? 'NewExchangeOrder' : 'Account View'
        }
        if (type === 'exchange_account') {
          const exchange = exchangeMap[acc.platform]
          item.image = getExchangeImage(exchange.name)
          item.params.exchangeName = exchange.name
          item.params.exchangeImage = exchange.image
        } else {
          if (type === 'wallet' && action === 'send') {
            item.disabled = !acc.onDisk
          }
          item.icon = Icons[type]
          item.Component = SimpleLineIcons
        }
        return item
      }).sort((a, b)=>a.disabled ? 1 : -1)
      this.setState({
        items
      })
    } catch (err) {
      console.error(err)
    }
  }

  updateHeader = () => {
    const { navigation } = this.props
    const {
      name,
      type,
      platform,
      action
    } =  navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const isTrade = action === 'buy' || action === 'sell'

    let heading, subHeading
    if (type === 'address') {
      heading = 'Select Address'
      subHeading = `Choose an address to view its price and balance history. If you want to make transactions, add the full wallet using the "import wallet" button below.`
    } else if (type === 'wallet') {
      heading = 'Select Wallet'
      subHeading = `Wallets with a blue icon are stored on this device and can be used to make transactions.`
    } else if (isTrade) {
      heading = 'Select Exchange'
      subHeading = `Choose one of your linked ${name} exchange accounts for this trade.`
    }
    this.setState({ heading, subHeading })
  }

  render() {
    const { navigation } = this.props
    const { type } = navigation.state.params
    const { heading, subHeading, items } = this.state

    return (
      <View style={{flex: 1}}>
      { !!(heading || subHeading) &&
        <View style={styles.header}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.subHeading}>{subHeading}</Text>
        </View>
      }
        <ScrollView style={{flex:1}}>
          <Menu
            navigation={navigation}
            items={items}
            baseColor={baseColor}
            brandColor={brandColor}
            baseAccent={baseAccent}
            style={{flex: 1}}
            listMargin={20}
          />
        </ScrollView>
        <View style={{flex: .2, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableHighlight
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}
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
               style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}
               onPress={()=>this.navigateToRestoreWalletScreen()}
            >
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <SimpleLineIcons style={{paddingRight: 10}} name={'cloud-upload'} color={brandColor} size={14} />
                <Text style={{ color: brandColor }}>import wallet</Text>
              </View>
            </TouchableHighlight>
        }
          </View>
      </View>
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
