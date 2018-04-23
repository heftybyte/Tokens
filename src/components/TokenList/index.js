import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { formatPrice, formatCurrencyChange, getTokenImage } from '../../helpers/functions'
import { baseAccent, baseColor, baseURL, gainColor, lossColor, brandColor } from '../../config'
import { showToast } from '../../reducers/ui'
import { trackAddress, trackTap } from '../../helpers/analytics'
import {
  addToWatchlist,
  removeFromWatchList
} from '../../reducers/account';

const WatchListItem = ({ item, showChange, onPress, showTokenInfo, index }) => {
  const changeStyle = parseInt(item.change) > -1 ? styles.gain : {}
  return (
    <TouchableHighlight onPress={showTokenInfo}> 
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <Text style={styles.orderText}>{index+1}.</Text>
        <View>
          <Image source={{ uri: getTokenImage(item.id) }} style={styles.image}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.balance}>${formatPrice(item.marketCap)}</Text>
        </View>
        <TouchableHighlight onPress={onPress}>
          <View style={[
            styles.priceContainer,
            changeStyle,
            // isLongPrice ? styles.longerPriceContainer : {}
          ]}>
              <Text style={[styles.price, /*isLongPrice ? styles.longPrice : {}*/]}>
                {showChange ?
                  String(item.change).substr(0,6) + '%' :
                  `$${formatPrice(item.price)}`}
                </Text>
          </View>
        </TouchableHighlight>
      </View>
    </TouchableHighlight>
  )
}

const TokenItem = ({ item, index, onPress, showTokenInfo, showChange, priceContainerExtended}) => {
  const changeStyle = item.change > 0 ? styles.gain : styles.loss
  const changeTextStyle = !item.change && styles.neutralColor || (parseInt(item.change) > -1 ? styles.gainColor : styles.lossColor)
  const isLongPrice = (`${item.balance * item.price}`).length >= 11
  const formattedPrice = item.price ? 
    `@ $${formatPrice(item.price)}` :
    ''
  const formattedTotal = item.price ?
    `$${formatPrice(item.balance * item.price)}` :
    'N/A'
  const formattedPriceChange = formatCurrencyChange(item.priceChange||0) || 'N/A'

  return (
    <TouchableHighlight onPress={showTokenInfo}>
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: getTokenImage(item.id) }} style={styles.image}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.balance}>
            {Number(item.balance.toFixed(5)).toLocaleString()} {formattedPrice} 
          </Text>
        </View>
        {/*<Text style={[changeTextStyle, styles.changeText]}>
          {parseInt(item.change) ? formattedTotal : ''}
        </Text>*/}
        <TouchableHighlight
          onPress={onPress}
          style={[
              styles.priceContainer,
              priceContainerExtended ? { width: priceContainerExtended } : {},
              changeStyle,
              !item.price ? styles.noPrice : {}
              // isLongPrice ? styles.longerPriceContainer : {}
          ]}
        >
          <Text style={[
              styles.price,
              !item.price ? styles.noPriceText : {}
              /*isLongPrice ? styles.longPrice : {}*/
          ]}>
            {showChange ? formattedPriceChange : formattedTotal}
          </Text>
        </TouchableHighlight>
      </View>
    </TouchableHighlight>
  )
};

const SearchItem = ({ item, onPress, showTokenInfo, index, chatEnabled }) => {
  return (
    <TouchableHighlight onPress={showTokenInfo}> 
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: getTokenImage(item.id) }} style={styles.image}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        {chatEnabled && <TouchableHighlight
          onPress={() => onPress(item) }
          style={[
              styles.priceContainer,
              styles.noPrice
          ]}
        >
          <Text style={styles.watchText}>CHAT</Text>
        </TouchableHighlight>}
      </View>
    </TouchableHighlight>
  )
}

class TokenList extends Component {

  state = {
    showChange: false,
    priceContainerExtended: false
  }

  static defaultProps = {
    type: "tokens"
  }

  renderWatchListItem = ({item, index}) => (
    <WatchListItem
      item={item}
      index={index}
      showTokenInfo={() => {
        trackTap('TokenInfo:WatchList')
        this.props.goToTokenDetailsPage(item);
      }}
      showChange={this.state.showChange}
      onPress={()=>{
        this.setState({showChange: !this.state.showChange})
        trackTap(this.state.showChange ? 'PriceToggle-watch-change' : 'PriceToggle-watch-price');
        this.props.showToast(
          this.state.showChange ? 'Absolute Change Since 24hrs Ago' : 'Price',
          { position: 'center', style: { backgroundColor: '#222' } },
          200
        )
      }}
    />
  )

  renderTokenItem = ({item, index}) => (
    <TokenItem
      item={item}
      index={index}
      showChange={this.state.showChange}
      watchList={this.props.watchList}
      priceContainerExtended={this.state.priceContainerExtended}
      showTokenInfo={() => {
        trackTap('TokenInfo:TokenItem')
        this.props.goToTokenDetailsPage(item);
      }}
      onPress={()=>{
        this.setState({showChange: !this.state.showChange}, () => {
          const { showChange } = this.state
          trackTap(showChange ? 'PriceToggle-change' : 'PriceToggle-total');
          this.props.showToast(
            showChange ? 'Absolute Change Since 24hrs Ago' : 'Total Value',
            { position: 'center', style: { backgroundColor: '#222' } },
            showChange ? 800 : 200
          )
        })
      }}
    />
  )

  adjustPriceContainerWidth = (props) => {
    const tokens = props.tokens || []
    tokens.sort((a,b)=>Number(a.price * a.balance) < Number(b.price * b.balance) ? 1 : -1)
    let priceContainerExtended = false
    const token = tokens[0]
    if (token && token.balance) {
      const sum = token.price * token.balance
      if (sum >= 1000000) {
        priceContainerExtended = 100
      } else if (sum >= 100000) {
        priceContainerExtended = 90
      }  
      this.setState({priceContainerExtended})
    }
  }

  componentDidMount = () => {
    this.adjustPriceContainerWidth(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    this.adjustPriceContainerWidth(nextProps)
  }

  renderSearchListItem = ({item, index}) => (
    <SearchItem
      item={item}
      index={index}
      chatEnabled={this.props.chatEnabled}
      showTokenInfo={() => {
        trackTap('TokenInfo:SearchItem')
        this.props.goToTokenDetailsPage(item);
      }}
      onPress={(item)=>{
        this.props.navigate('Chat', { token: item })
      }}
    />
  )

  render() {
    const { showChange } = this.state
    const { title='', type } = this.props
    const render = {
      tokens: this.renderTokenItem,
      watchList: this.renderWatchListItem,
      search: this.renderSearchListItem
    }
    const dataTokens = (this.props.tokens || []).map((token, i)=>({...token, key: token.symbol}))
    if (type === 'tokens') {
      if (!showChange) {
        dataTokens.sort((a,b)=>Number(a.price * a.balance) < Number(b.price * b.balance) ? 1 : -1)
      } else {
        dataTokens.sort((a,b)=>Math.abs(a.priceChange) < Math.abs(b.priceChange) ? 1 : -1)
      }
    }

    return (
      <View>
        <SectionList
          style={styles.container}
          renderSectionHeader={({section}) => !!section.title && <Text style={styles.sectionHeader}>{section.title}</Text>}
          sections={[
            {
              data: dataTokens,
              title: title.toUpperCase(),
              renderItem: render[type]
            }
          ]}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  chatEnabled: state.account.chatEnabled
})

const mapDispatchToProps = (dispatch) => ({
    addToWatchlist: (symbol, token) => dispatch(addToWatchlist(symbol, token)),
    removeFromWatchList: (symbol, token) => dispatch(removeFromWatchList(symbol, token)),
    navigate: (routeName, params) => dispatch(NavigationActions.navigate({ routeName, params })),
    goToTokenDetailsPage: (token) => dispatch(NavigationActions.navigate({ routeName: 'Token Details', params: {token} })),
    showToast: (msg, props, duration) => dispatch(showToast(msg, props, duration))
})

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: baseColor,
    paddingBottom: 20
  },
  symbol: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Light'
  },
  name: {
    color: '#555',
    fontSize: 16,
    fontFamily: 'Nunito-Light'
  },
  balance: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Nunito'
  },
  symbolContainer: {
    flex: .9
  },
  priceContainer: {
    width: 80,
    height: 33.33,
    backgroundColor: lossColor,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noPrice: {
    backgroundColor: baseColor,
    borderColor: '#fff'
  },
  noPriceText: {
    color: '#fff'
  },
  watchText: {
    fontSize: 11,
    color: '#fff'
  },
  unwatchText: {
    fontSize: 11,
    color: brandColor
  },
  chatButtonContainer: {
    borderColor: brandColor
  },
  longerPriceContainer: {
    paddingLeft: 30,
    paddingRight: 30
  },
  longPrice: {
    width: 105
  },
  price: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Nunito'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: baseAccent,
    borderTopWidth: 1,
    backgroundColor: baseColor
  },
  noBorderTop: {
    borderTopWidth: 0
  },
  sectionHeader: {
    color: "#fff",
    backgroundColor: baseColor,
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Nunito'
  },
  gain: {
    backgroundColor: gainColor,
  },
  loss: {
    backgroundColor: lossColor
  },
  arrowText: {
  },
  changeText: {
    fontSize: 12,
    textAlignVertical: 'top',
    marginLeft: 10
  },
  gainColor: {
    color: gainColor
  },
  lossColor: {
    color: lossColor
  },
  neutralColor: {
    color: '#fff'
  },
  orderText: {
    color: '#fff',
    fontSize: 12
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 8
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenList);