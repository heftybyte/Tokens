import React, { Component } from 'react';
import { View, ScrollView, Image } from "react-native"
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import { baseAccent, baseColor, brandColor } from '../../config'
import { Menu } from '../Common/Menu'

const HeaderText = {
  'wallet': 'Wallets',
  'address': 'Addresses',
  'exchange_account': 'Exchanges'
}

class AccountType extends Component {

  static getHeaderText = (navState) => {
    return HeaderText[navState.params.type]
  }

  render() {
    const { navigation, exchangeList, blockchainList } = this.props
      console.log(navigation, exchangeList, blockchainList)
    const { type } = navigation.state.params
    const menuItems = {
      'wallet': blockchainList.map(b=>
        ({
          ...b,
          route: 'Select Account',
          params: {
            image: b.image,
            name: b.name,
            type: 'wallet',
            platformId: b.id
          }
        })
      ),
      'address': blockchainList.map(b=>
        ({
          ...b,
          route: 'Select Account',
          params: {
            image: b.image,
            name: b.name,
            type: 'address',
            platformId: b.id
          }
        })
      ),
      'exchange_account': exchangeList.map(e=>
        ({
          ...e,
          route: 'Select Account',
          params: {
            image: e.image,
            name: e.name,
            type: 'exchange_account',
            platformId: e.id
          }
        })
      )
    }

    return (
      <ScrollView>
        <Menu
          navigation={navigation}
          items={menuItems[type]}
          baseColor={baseColor}
          brandColor={brandColor}
          baseAccent={baseAccent}
          style={{flex: 1}}
          listMargin={20}
        />
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => ({
  exchangeList: state.exchanges.list,
  blockchainList: state.blockchains.list
})

export default connect(mapStateToProps)(withDrawer(AccountType));
