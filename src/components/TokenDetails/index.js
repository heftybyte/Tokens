import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import Header from '../Dashboard/Header';

import { getTokenDetails } from '../../reducers/account';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  containerChild: {
    marginBottom: 10
  },
  tokenColor: {
    color: '#fff'
  },
  header: {
    backgroundColor: '#000'
  },
  heading: {
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    color: '#fff',
    fontSize: 22,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 10
  }
});

class TokenDetails extends Component {
  componentWillMount = async () => {
    const { getTokenDetails } = this.props
    await getTokenDetails(this.props.symbol)
  }

  render() {
    const { price, quantity, marketCap, volume24Hr, totalValue } = this.props.tokenDetails

    return (
      <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
        <Header totalValue={totalValue} />
        <Text style={styles.heading}>
          Token Info
        </Text>

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenColor}>Price</Text>
            <Text style={styles.tokenColor}>{price}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenColor}>Quantity</Text>
            <Text style={styles.tokenColor}>{quantity}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.containerChild}>
            <Text style={styles.tokenColor}>MarketCap</Text>
            <Text style={styles.tokenColor}>{marketCap}</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={styles.tokenColor}>24 hr Volume</Text>
            <Text style={styles.tokenColor}>{volume24Hr}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

TokenDetails.navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.price || 'Dashboard'}`,
  headerStyle: styles.header,
  headerLeft:(
        <MaterialCommunityIcons
          style={{paddingLeft:20}}
          name="menu"
          size={22}
          color="white"
          onPress={()=>{navigation.dispatch({type: 'Dashboard'})}}
        />),
  headerRight: <Ionicons onClick={()=>{}} style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
});

const mapDispatchToProps = (dispatch) => ({
  getTokenDetails: (sym) => dispatch(getTokenDetails(sym))
})

const mapStateToProps = (state, props) => ({
  symbol: props.navigation.state.params.token.symbol,
  tokenDetails: state.account.tokenDetails
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails);