import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from "react-native"
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import { getExchangeImage } from '../../helpers/functions'
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

  getAccounts = (type, platformId) => {
    const stateField = AccountSources[type]
    const idField = AccountSourceId[type]
    const accounts = (this.props[stateField] || [])//.filter(acc=>acc[idField]===platformId)
    return accounts
  }

  navigateToAddScreen = () => {
    const { navigation, goToRoute } = this.props
    const { type, platformId, action } =  navigation.state.params
    const routeName = platformId ? AddScreens[type] : 'AccountType'
    goToRoute(routeName, navigation.state.params)
  }

  render() {
    const { navigation, addresses, goToRoute, exchangeMap } = this.props
    const {
      name,
      type,
      platformId,
      action,
      contractAddress,
      currencyName,
      currencySymbol,
      image
    } =  navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const isTrade = action === 'buy' || action === 'sell'
    const items = this.getAccounts(type, platformId).map((acc)=>{
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

    return (
      <ScrollView style={{flex:1}}>
       {isTransaction && 
          <View style={styles.header}>
            <Text style={styles.heading}>Select Wallet</Text>
            <Text style={styles.subHeading}>Choose one of your wallets for this transaction.</Text>
          </View>
       }
      {isTrade && 
          <View style={styles.header}>
            <Text style={styles.heading}>Select Exchange</Text>
            <Text style={styles.subHeading}>Choose one of your linked exchange accounts for this trade.</Text>
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
        <TouchableHighlight onPress={()=>this.navigateToAddScreen()}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}>
            <SimpleLineIcons style={{paddingRight: 10}} name={'plus'} color={brandColor} size={14} />
            <Text style={{ color: brandColor}}>add new {name} {type.replace('_', ' ')}</Text>
          </View>
        </TouchableHighlight>
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
