import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from "react-native"
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
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

  componentWillMount = () => {
    // const { navigation, goToRoute } = this.props
    // const { type, platform } =  navigation.state.params
    // const accounts = this.getAccounts(type, platform)
    // const addScreen = AddScreens[type]
    // if (accounts.length === 0) {
    //   goToRoute(addScreen, { type, platform })
    // }
  }

  getAccounts = (type, platform) => {
    const stateField = AccountSources[type]
    const accounts = (this.props[stateField] || []).filter(acc=>acc.platform===platform)
    return accounts
  }

  navigateToAddScreen = () => {
    const { navigation, goToRoute } = this.props
    const { type, platform, action } =  navigation.state.params
    const routeName = platform ? AddScreens[type] : 'AccountType'
    goToRoute(routeName, navigation.state.params)
  }

  render() {
    const { navigation, addresses, goToRoute } = this.props
    const { type, platform, action, contractAddress, currencyName, currencySymbol, image } =  navigation.state.params
    const isTransaction = action === 'send' || action === 'recieve'
    const items = this.getAccounts(type, platform).map((acc)=>({
      name: `${acc.id.substr(0, 20)}...${acc.id.substr(38,42)}`,
      params: { id: acc.id, type, platform, contractAddress, currencyName, currencySymbol, image },
      route: isTransaction ? 'SendTransaction' : 'Account View',
      icon: Icons[type],
      Component: SimpleLineIcons   
    }))

    return (
      <ScrollView style={{flex:1}}>
       {isTransaction && 
          <View style={styles.header}>
            <Text style={styles.heading}>Select Wallet</Text>
            <Text style={styles.subHeading}>Choose one of your wallets for this transaction</Text>
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
            <Text style={{ color: brandColor}}>add new {platform} {type.replace('_', ' ')}</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => ({
  addresses: state.account.addresses,
  wallets: state.account.wallets,
  exchangeAccounts: state.account.exchangeAccounts
})

const mapDispatchToProps = (dispatch) => {
  return {
    goToRoute: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(AccountPicker));
