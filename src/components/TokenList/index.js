import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { formatPrice, formatCurrencyChange, getTokenImage } from '../../helpers/functions'
import { baseURL, gainColor, lossColor, brandColor } from '../../config'
import { showToast } from '../../reducers/ui'
import { trackAddress, trackTap } from '../../helpers/analytics'
import {
  addToWatchlist,
  removeFromWatchList
} from '../../reducers/account';

const WatchListItem = ({ item, showChange, onPress, showTokenInfo, index }) => {
  const changeStyle = parseInt(item.change) > -1 ? styles.gain : {}
  return (
    <TouchableOpacity onPress={showTokenInfo}> 
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <Text style={styles.orderText}>{index+1}.</Text>
        <View>
          <Image source={{ uri: getTokenImage(item) }} style={styles.image}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.balance}>${formatPrice(item.marketCap)}</Text>
        </View>
        <TouchableOpacity onPress={onPress}>
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
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const TokenItem = ({ item, index, onPress, showTokenInfo, showChange}) => {
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
    <TouchableOpacity onPress={showTokenInfo}>
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: getTokenImage(item) }} style={styles.image}/>
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
        <TouchableOpacity
          onPress={onPress}
          style={[
              styles.priceContainer,
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
            {showChange ? formattedTotal : formattedPriceChange}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
};

const SearchItem = ({ item, onPress, showTokenInfo, index, watchList }) => {
  let itemOnWatchlist = !!watchList[item.symbol]
  return (
    <TouchableOpacity onPress={showTokenInfo}> 
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: getTokenImage(item) }} style={styles.image}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onPress(itemOnWatchlist, item.symbol) }
          style={[
              styles.priceContainer,
              styles.noPrice,
              itemOnWatchlist ? styles.unwatchContainer : {}
          ]}
        >
          {
            itemOnWatchlist ?
            <Text style={[styles.unwatchText]}>UNWATCH</Text>
              :
            <Text style={[styles.watchText]}>WATCH</Text>
          }

        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

class TokenList extends Component {

  state = {
    showChange: false
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
          this.state.showChange ? 'Price' : 'Change Since 24hrs Ago',
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
      showTokenInfo={() => {
        trackTap('TokenInfo:TokenItem')
        this.props.goToTokenDetailsPage(item);
      }}
      onPress={()=>{
        this.setState({showChange: !this.state.showChange}, () => {
          const { showChange } = this.state
          trackTap(showChange ? 'PriceToggle-change' : 'PriceToggle-total');
          this.props.showToast(
            showChange ? 'Total Change Since 24hrs Ago' : 'Total Value',
            { position: 'center', style: { backgroundColor: '#222' } },
            showChange ? 800 : 200
          )
        })
      }}
    />
  )

  renderSearchListItem = ({item, index}) => (
    <SearchItem
      item={item}
      index={index}
      watchList={this.props.watchList}
      showTokenInfo={() => {
        trackTap('TokenInfo:SearchItem')
        this.props.goToTokenDetailsPage(item);
      }}
      onPress={(setWatch, symbol)=>{
        if(setWatch){
          //Alert.alert('Watch list coming soon delete')
          this.props.removeFromWatchList(symbol)
        } else {
          //Alert.alert('Watch list coming soon add' + symbol)
          this.props.addToWatchlist(symbol)
        }
      }}
    />
  )

  render() {
    const { showChange } = this.state
    const { title } = this.props
    const render = {
      tokens: this.renderTokenItem,
      watchList: this.renderWatchListItem,
      search: this.renderSearchListItem
    }
    const dataTokens = (this.props.tokens || []).map((token, i)=>({...token, key: token.symbol}))
    return (
      <View>
        <SectionList
          style={styles.container}
          renderSectionHeader={({section}) => !!section.title && <Text style={styles.sectionHeader}>{section.title}</Text>}
          sections={[
            {
              data: dataTokens,
              title: (this.props.title || '').toUpperCase(),
              renderItem: render[this.props.type]
            }
          ]}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    addToWatchlist: symbol => dispatch(addToWatchlist(symbol)),
    removeFromWatchList: symbol => dispatch(removeFromWatchList(symbol)),
    goToTokenDetailsPage: (token) => dispatch(NavigationActions.navigate({ routeName: 'Token Details', params: {token} })),
    showToast: (msg, props, duration) => dispatch(showToast(msg, props, duration))
})

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: '#000',
    paddingBottom: 20
  },
  symbol: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Light'
  },
  balance: {
    color: '#555',
    fontSize: 12,
    fontFamily: 'Nunito'
  },
  symbolContainer: {
    flex: .6
  },
  priceContainer: {
    width: 96,
    height: 40,
    backgroundColor: lossColor,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 13
  },
  noPrice: {
    backgroundColor: '#000',
    borderColor: '#fff'
  },
  noPriceText: {
    color: '#fff'
  },
  watchText: {
    color: '#fff'
  },
  unwatchText: {
    color: brandColor
  },
  unwatchContainer: {
    borderColor: brandColor,
    paddingHorizontal: 8
  },
  longerPriceContainer: {
    paddingLeft: 30,
    paddingRight: 30
  },
  longPrice: {
    width: 105
  },
  price: {
    color: '#000',
    textAlign: 'center',
    width: 85,
    fontFamily: 'Nunito'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: '#111',
    borderTopWidth: 1
  },
  noBorderTop: {
    borderTopWidth: 0
  },
  sectionHeader: {
    color: "#fff",
    backgroundColor: '#000',
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

export default connect(()=>({}), mapDispatchToProps)(TokenList);