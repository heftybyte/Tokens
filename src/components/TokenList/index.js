import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    Image,
    TouchableHighlight
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { formatPrice } from '../../helpers/functions'

const baseURL = process.env.NODE_ENV === 'production' ?
  'http://138.197.104.147:3000' :
  'http://138.197.104.147:3000'

const Watchlist = ({ item, index }) => {
  const changeStyle = parseInt(item.change) > -1 ? styles.gain : {}
  return (
    <TouchableHighlight>
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: baseURL + item.imageUrl }} style={{width: 30, height: 30}}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.balance}>${formatPrice(item.marketCap)}</Text>
        </View>
        <View style={[
          styles.priceContainer,
          changeStyle,
          // isLongPrice ? styles.longerPriceContainer : {}
        ]}>
          <Text style={[styles.price, /*isLongPrice ? styles.longPrice : {}*/]}>
            ${formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const TokenItem = ({ item, index, showChange, onPress, showTokenInfo}) => {
  const changeStyle = parseInt(item.change) > -1 ? styles.gain : {}
  const isLongPrice = (`${item.balance * item.price}`).length >= 11
  const formattedPrice = item.price ? 
    `@ $${item.price.toLocaleString().substr(0,5)}` :
    ''
  const formattedTotal = item.price ?
    `$${formatPrice(item.balance * item.price)}` :
    'N/A'
  return (
    <TouchableHighlight onPress={showTokenInfo}>
      <View style={[styles.listItem, index == 0 ? styles.noBorderTop : {}]}>
        <View>
          <Image source={{ uri: baseURL + item.imageUrl }} style={{width: 30, height: 30}}/>
        </View>

        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.balance}>
            {String(item.balance).substr(0,5)} {formattedPrice}
          </Text>
        </View>
        <View style={[
            styles.priceContainer,
            changeStyle,
            // isLongPrice ? styles.longerPriceContainer : {}
        ]}>
          <Text style={[styles.price, /*isLongPrice ? styles.longPrice : {}*/]} onPress={onPress}>
            {showChange ?
              String(item.change).substr(0,6) + '%' :
              formattedTotal}
            </Text>
          </View>
        </View>
    </TouchableHighlight>
  )
};

class TokenList extends Component {

  state = {
    showChange: false
  }

  static defaultProps = {
  	type: "tokens"
  }

  renderWatchlist = ({item, index}) => (
    <Watchlist
      item={item}
      index={index}
      showTokenInfo={() => {
        return // TODO: fix token details page
			  this.props.goToTokenDetailsPage(item);
      }}
    />
  )

  renderTokens = ({item, index}) => (
    <TokenItem
      item={item}
      index={index}
      showChange={this.state.showChange}
      showTokenInfo={() => {
        return // TODO: fix token details page
			  this.props.goToTokenDetailsPage(item);
      }}
      onPress={()=>{
			  console.log('toggle!')
			  this.setState({showChange: !this.state.showChange})
      }}
    />
  )

  render() {
    const { showChange } = this.state
    let dataTokens = this.props.tokens || []
    const { title } = this.props
	  let dataWatchList = this.props.watchList || []

    dataTokens = dataTokens.map(tokenObj => (
      {
        ...tokenObj,
        key: tokenObj.symbol
      }
    ))
	  dataWatchList = dataWatchList.map(tokenObj => (
	  {
		  ...tokenObj,
		  key: tokenObj.symbol
	  }
	  ))

	  const render = {
    	tokens: this.renderTokens,
		  watchList: this.renderWatchlist
	  }

	  const data = {
		  tokens: dataTokens,
		  watchList: dataWatchList
	  }

    return (
      <View>
        <SectionList
          style={styles.container}
          renderSectionHeader={({section}) => !!section.title && <Text style={styles.sectionHeader}>- {section.title} -</Text>}
          sections={[
            {
            	data: data[this.props.type],
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
    goToTokenDetailsPage: (token) => dispatch(NavigationActions.navigate({ routeName: 'TokenDetails', params: {token} }))
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
    color: '#333',
    fontSize: 12,
    fontFamily: 'Nunito'
  },
  symbolContainer: {
    flex: .6,
  },
  priceContainer: {
    flex: .2,
    height: 40,
    backgroundColor: '#b63e15',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#b63e15',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
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
    backgroundColor: '#48ba94',
    borderColor: '#48ba94'
  }
});

export default connect(()=>({}), mapDispatchToProps)(TokenList);