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
      params: { platform: "exchange" },
      image: require("../../../assets/bibox-icon.png"),
      route: "Select Account"
  },
  {
      name: "Binance",
      params: { platform: "exchange" },
      image: require("../../../assets/binance-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bit-Z",
      params: { platform: "exchange" },
      image: require("../../../assets/bitz-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitbank",
      params: { platform: "exchange" },
      image: require("../../../assets/bitbank-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitfinex",
      params: { platform: "exchange" },
      image: require("../../../assets/bitfinex-icon.png"),
      route: "Select Account"
  },
  {
      name: "bitFlyer",
      params: { platform: "exchange" },
      image: require("../../../assets/bitflyer-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bittrex",
      params: { platform: "exchange" },
      image: require("../../../assets/bittrex-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bitstamp",
      params: { platform: "exchange" },
      image: require("../../../assets/bitstamp-icon.png"),
      route: "Select Account"
  },
  {
      name: "Bithumb",
      params: { platform: "exchange" },
      image: require("../../../assets/bithumb-icon.png"),
      route: "Select Account"
  },
  {
      name: "BTCBOX",
      params: { platform: "exchange" },
      image: require("../../../assets/btcbox-icon.png"),
      route: "Select Account"
  },
  {
      name: "BTCC",
      params: { platform: "exchange" },
      image: require("../../../assets/btcc-icon.png"),
      route: "Select Account"
  },
  {
      name: "Coinone",
      params: { platform: "exchange" },
      image: require("../../../assets/coinone-icon.png"),
      route: "Select Account"
  },
  {
      name: "EXMO",
      params: { platform: "exchange" },
      image: require("../../../assets/exmo-icon.png"),
      route: "Select Account"
  },
  {
      name: "EXX",
      params: { platform: "exchange" },
      image: require("../../../assets/exx-icon.png"),
      route: "Select Account"
  },
  {
      name: "Gate.io",
      params: { platform: "exchange" },
      image: require("../../../assets/gateio-icon.png"),
      route: "Select Account"
  },
  {
      name: "GDAX",
      params: { platform: "exchange" },
      image: require("../../../assets/gdax-icon.png"),
      route: "Select Account"
  },
  {
      name: "Gemini",
      params: { platform: "exchange" },
      image: require("../../../assets/gemini-icon.png"),
      route: "Select Account"
  },
  {
      name: "HitBTC",
      params: { platform: "exchange" },
      image: require("../../../assets/hitbtc-icon.png"),
      route: "Select Account"
  },
  {
      name: "Huobi",
      params: { platform: "exchange" },
      image: require("../../../assets/huobi-icon.png"),
      route: "Select Account"
  },
  {
      name: "Kraken",
      params: { platform: "exchange" },
      image: require("../../../assets/kraken-icon.png"),
      route: "Select Account"
  },
  {
      name: "Kucoin",
      params: { platform: "exchange" },
      image: require("../../../assets/kucoin-icon.png"),
      route: "Select Account"
  },
  {
      name: "LBANK",
      params: { platform: "exchange" },
      image: require("../../../assets/lbank-icon.png"),
      route: "Select Account"
  },
  {
      name: "Liqui",
      params: { platform: "exchange" },
      image: require("../../../assets/liqui-icon.png"),
      route: "Select Account"
  },
  {
      name: "Poloniex",
      params: { platform: "exchange" },
      image: require("../../../assets/poloniex-icon.png"),
      route: "Select Account"
  },
  {
      name: "Wex",
      params: { platform: "exchange" },
      image: require("../../../assets/wex-icon.png"),
      route: "Select Account"
  },
  {
      name: "ZB",
      params: { platform: "exchange" },
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
  'exchange': exchanges.map(e=>
    ({
      ...e,
      params: {
        ...(e.params),
        type: 'exchange'
      }
    })
  )
}

const HeaderText = {
  'wallet': 'Wallets',
  'address': 'Addresses',
  'exchange': 'Exchanges'
}

class AccountType extends Component {

  componentWillMount = () => {
    const { navigation } = this.props
    const { type } = navigation.state.params
    navigation.setParams({ overrideHeaderText: HeaderText[type] });
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
