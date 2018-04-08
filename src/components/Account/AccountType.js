import React, { Component } from 'react';
import { View, ScrollView, Image } from "react-native"
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import { baseAccent, baseColor, brandColor } from '../../config'
import { Menu } from '../Common/Menu'

const blockchains = [
  {
      name: "Ethereum",
      params: { platform: "ethereum" },
      image: require("../../../assets/ethereum-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitcoin",
      params: { platform: "bitcoin" },
      image: require("../../../assets/bitcoin-icon.png"),
      route: "Select Account"
  },
  {
      name: "NEO",
      params: { platform: "neo" },
      image: require("../../../assets/neo-icon.png"),
      route: "Select Account"
  },
  {
      name: "Stellar",
      params: { platform: "stellar" },
      image: require("../../../assets/stellar-icon.png"),
      route: "Select Account"
  }
]

const exchanges = [
  {
      name: "Bibox",
      params: { platform: "Bibox", type: "exchange_account"},
      image: require("../../../assets/bibox-icon.png"),
      route: "Select Account"
  },
  {
      name: "Binance",
      params: { platform: "Binance", type: "exchange_account" },
      image: require("../../../assets/binance-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bit-Z",
      params: { platform: "Bit-Z", type: "exchange_account" },
      image: require("../../../assets/bitz-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitbank",
      params: { platform: "Bitbank", type: "exchange_account" },
      image: require("../../../assets/bitbank-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitfinex",
      params: { platform: "Bitfinex", type: "exchange_account" },
      image: require("../../../assets/bitfinex-icon.png"),
      route: "Select Account"
  },
  {
      name: "bitFlyer",
      params: { platform: "bitFlyer", type: "exchange_account" },
      image: require("../../../assets/bitflyer-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bittrex",
      params: { platform: "Bittrex", type: "exchange_account" },
      image: require("../../../assets/bittrex-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitstamp",
      params: { platform: "Bitstamp", type: "exchange_account" },
      image: require("../../../assets/bitstamp-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bithumb",
      params: { platform: "Bithumb", type: "exchange_account" },
      image: require("../../../assets/bithumb-icon.png"),
      route: "Select Account"
  },
  {
      name: "BTCBOX",
      params: { platform: "BTCBOX", type: "exchange_account" },
      image: require("../../../assets/btcbox-icon.png"),
      route: "Select Account"
  },
  {
      name: "BTCC",
      params: { platform: "BTCC", type: "exchange_account" },
      image: require("../../../assets/btcc-icon.png"),
      route: "Select Account"
  },
  {
      name: "Coinone",
      params: { platform: "Coinone", type: "exchange_account" },
      image: require("../../../assets/coinone-icon.png"),
      route: "Select Account"
  },
  {
      name: "EXMO",
      params: { platform: "EXMO", type: "exchange_account" },
      image: require("../../../assets/exmo-icon.png"),
      route: "Select Account"
  },
  {
      name: "EXX",
      params: { platform: "EXX", type: "exchange_account" },
      image: require("../../../assets/exx-icon.png"),
      route: "Select Account"
  },
  {
      name: "Gate.io",
      params: { platform: "Gate.io", type: "exchange_account" },
      image: require("../../../assets/gateio-icon.png"),
      route: "Select Account"
  },
  {
      name: "GDAX",
      params: { platform: "GDAX", type: "exchange_account" },
      image: require("../../../assets/gdax-icon.png"),
      route: "Select Account"
  },
  {
      name: "Gemini",
      params: { platform: "Gemini", type: "exchange_account" },
      image: require("../../../assets/gemini-icon.png"),
      route: "Select Account"
  },
  {
      name: "HitBTC",
      params: { platform: "HitBTC", type: "exchange_account" },
      image: require("../../../assets/hitbtc-icon.png"),
      route: "Select Account"
  },
  {
      name: "Huobi",
      params: { platform: "Huobi", type: "exchange_account" },
      image: require("../../../assets/huobi-icon.png"),
      route: "Select Account"
  },
  {
      name: "Kraken",
      params: { platform: "Kraken", type: "exchange_account" },
      image: require("../../../assets/kraken-icon.png"),
      route: "Select Account"
  },
  {
      name: "Kucoin",
      params: { platform: "exchange", type: "exchange_account" },
      image: require("../../../assets/kucoin-icon.png"),
      route: "Select Account"
  },
  {
      name: "LBANK",
      name: "LBANK",
      params: { platform: "exchange", type: "exchange_account" },
      image: require("../../../assets/lbank-icon.png"),
      route: "Select Account"
  },
  {
      name: "Liqui",
      params: { platform: "Liqui", type: "exchange_account" },
      image: require("../../../assets/liqui-icon.png"),
      route: "Select Account"
  },
  {
      name: "Poloniex",
      params: { platform: "Poloniex", type: "exchange_account" },
      image: require("../../../assets/poloniex-icon.png"),
      route: "Select Account"
  },
  {
      name: "Wex",
      params: { platform: "Wex", type: "exchange_account" },
      image: require("../../../assets/wex-icon.png"),
      route: "Select Account"
  },
  {
      name: "ZB",
      params: { platform: "ZB", type: "exchange_account" },
      image: require("../../../assets/zb-icon.png"),
      route: "Select Account"
  }
]

const MenuItems = {
  'wallet': blockchains.map(b=>
    ({
      ...b,
      params: {
        ...(b.params),
        type: 'wallet'
      }
    })
  ),
  'address': blockchains.map(b=>
    ({
      ...b,
      params: {
        ...(b.params),
        type: 'address'
      }
    })
  ),
  'exchange_account': exchanges.map(e=>
    ({
      ...e,
      params: {
        ...(e.params),
        image: e.image,
        type: 'exchange_account'
      }
    })
  )
}

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
    const { navigation } = this.props
    const { type } = navigation.state.params

    return (
      <ScrollView>
        <Menu
          navigation={navigation}
          items={MenuItems[type]}
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


export default connect()(withDrawer(AccountType));
