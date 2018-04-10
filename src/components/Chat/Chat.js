/*
  Created By Seun LanLege
  1:53 PM 15 Thu Mar 2018
*/
import React, { Component } from "react"
import { connect } from 'react-redux'
import { Animated, Easing, Image, Platform, View, Text, TouchableHighlight, TouchableWithoutFeedback } from "react-native"
import { SimpleLineIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat'
import KeyboardSPacer from "react-native-keyboard-spacer"
import { Menu } from '../Common/Menu'
import { baseAccent, baseColor, brandColor } from '../../config'
import { withDrawer } from '../../helpers/drawer'
import { getTokenImage } from '../../helpers/functions'
import Backend from './Backend'

const defaultToken = {
	symbol: 'TKE',
	name: 'Tokens Express',
	id: 'tke'
}
class Chat extends Component {

	static getHeader = (navState) => {
		let { token } = navState.params || {}
		token = token || defaultToken
		const fontSize = (token.name || token.symbol).length >= 14 ?
			13 : 16
		return (
		  <View style={{
			  flexDirection: 'row',
			  alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
			  alignItems: 'center',
			  flex:1,
			  paddingTop: 10
		  }}>
			<Image
				key={token.symbol}
				source={{ uri: getTokenImage(token.id) }}
				style={{width: 25, height: 22 }}
			/>
			 <Text style={{color: '#fff', paddingHorizontal: 10, fontSize}}>
				{token.name||token.symbol}
			 </Text>
			 <SimpleLineIcons name={'arrow-down'} color={'#fff'} />
		  </View>
		)
	 }

	state = {
		messages: [],
		menuHeight: new Animated.Value(1),
		menuOpen: false
	}

	updateHeader = (props) => {
		const {
		  navigation
		} = props || this.props
		token = token || defaultToken
		const { id } = navigation.state.params
		const { menuOpen } = this.state
		let { token } = navigation.state.params || {} 
		const image = getTokenImage(token.id)
		const fontSize = (token.name || token.symbol).length >= 14 ?
			14 : 16
		this.menuItems = [
		  {
			name: "Buy",
			icon: 'credit-card',
			Component: SimpleLineIcons,
			params: {
			  type: 'exchange_account',
			  image,
			  action: 'buy',
			  contractAddress: token.address, 
			  currencyName: token.name,
			  currencySymbol: token.symbol,
			  price: token.price
			},
			route: "Select Account"
		  },
		  {
			name: "Sell",
			icon: 'cursor',
			params: {
			  type: 'exchange_account', image,
			  action: 'sell',
			  contractAddress: token.address, 
			  currencyName: token.name,
			  currencySymbol: token.symbol,
			  price: token.price
			},
			Component: SimpleLineIcons,
			route: "Select Account"
		  },
		  {
			name: "Send",
			icon: 'arrow-right-circle',
			params: { 
			  type: 'wallet',
			  platform: 'ethereum',
			  action: 'send',
			  contractAddress: token.address, 
			  currencyName: token.name,
			  currencySymbol: token.symbol,
			  image
			},
			Component: SimpleLineIcons,
			route: "Select Account"
		  },
		  {
			name: "Recieve",
			icon: 'arrow-left-circle',
			params: {
			  type: 'wallet',
			  platform: 'ethereum',
			  action: 'recieve',
			  contractAddress: token.address,
			  currencyName:token.name,
			  currencySymbol: token.symbol,
			  image
			},
			Component: SimpleLineIcons,
			route: "Select Account"
		  }
		]

		navigation.setParams({ overrideHeader:
		  <TouchableWithoutFeedback onPress={this.toggleMenu} style={{width:'100%', height:40}}> 
			  <View style={{
				  flexDirection: 'row',
				  alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
				  alignItems: 'center',
				  flex:1,
				  paddingTop: 10
			  }}>
				  <Image
					key={token.symbol}
					source={{ uri: image }}
					style={{width: 25, height: 22 }}
				  />
				  <Text style={{color: '#fff', paddingHorizontal: 10, fontSize}}>
					  {token.name||token.symbol}
				  </Text>
				  <SimpleLineIcons name={menuOpen ? 'arrow-up' : 'arrow-down'} color={'#fff'} />
			  </View>
		  </TouchableWithoutFeedback>
		})
	}

	toggleMenu = () => {
		// TODO Refactor into base or sub component 
		const { menuOpen, menuHeight } = this.state
		Animated.timing(
		  menuHeight,
		  {
			duration: 350,
			toValue: menuOpen ? 1 : this.menuItems.length * 75
		  }
		).start()
		this.setState({
		  menuOpen: !menuOpen
		})
		this.updateHeader()
	}

	componentWillReceiveProps = (nextProps) => {
		this.updateHeader(nextProps)  
	}

	componentWillMount = async () => {
		const { token, userId } = this.props
		Backend.setRef(token && token.symbol || 'TKE')
		await Backend.authenticate(userId)
		this.updateHeader()
		console.log('uid', Backend.getUid())
	}

	componentDidMount() {
		Backend.loadMessages((message) => {
			this.setState((previousState) => {
				return {
					messages: GiftedChat.append(previousState.messages, message),
				};
			});
		});
	}

	componentWillUnmount() {
		Backend.closeChat();
	}

	onSend = (messages = []) => {
		Backend.sendMessage(messages)
	}

	render() {
		return (
			<View
				style={{
					flex: 1
				}}
			>
				<View style={{zIndex:1}}>
				  <Animated.View style={{height: this.state.menuHeight, overflow: 'hidden'}}>
					<Menu
					  onPress={this.toggleMenu}
					  navigation={this.props.navigation}
					  items={this.menuItems||[]}
					  baseColor={baseColor}
					  brandColor={brandColor}
					  baseAccent={baseAccent}
					  style={{flex: 1}}
					  listMargin={20}
					/>
				  </Animated.View>
				</View>
				<GiftedChat
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: Backend.getUid(),
						name: this.props.username
					}}
				/>
				<KeyboardSPacer />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
  username: state.account.username,
  userId: state.account.id,
  ...state.ui
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Chat));
