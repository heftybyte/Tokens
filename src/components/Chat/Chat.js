import React, { Component } from "react"
import { connect } from 'react-redux'
import { Animated, Easing, Image, Platform, View, Text, TouchableHighlight, TouchableWithoutFeedback } from "react-native"
import { SimpleLineIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat'
import KeyboardSpacer from "react-native-keyboard-spacer"
import { Menu } from '../Common/Menu'
import { baseAccent, baseColor, brandColor } from '../../config'
import { withDrawer } from '../../helpers/drawer'
import { getTokenImage } from '../../helpers/functions'
import Backend from './Backend'
import Message from './Message'
import emojiUtils from 'emoji-utils';

const defaultToken = {
	symbol: 'TKE',
	name: 'Tokens Express',
	id: 'tke'
}

class Chat extends Component {

	static getHeader = (navState) => {
		let { token } = navState.params || {}
		token = token || defaultToken
		return (
		  <View style={{
			  flexDirection: 'row',
			  alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
			  alignItems: 'center',
			  flex:1
		  }}>
			<Image
				key={token.symbol}
				source={{ uri: getTokenImage(token.id) }}
				style={{width: 20, height: 20, borderRadius: 5 }}
			/>
			 <Text style={{color: '#fff', paddingHorizontal: 10, fontSize: 16}}>
				{token.name||token.symbol}
			 </Text>
			 {/*<SimpleLineIcons name={'arrow-down'} color={'#fff'} />*/}
		  </View>
		)
	}

	state = {
		messages: [],
		menuHeight: new Animated.Value(1),
		menuOpen: false
	}

	updateHeader = () => {
		const {
		  navigation
		} = this.props
		let { id, token } = navigation.state.params || {} 
		token = token || defaultToken
		const { menuOpen } = this.state
		const image = getTokenImage(token.id)

		this.menuItems = [
		  {
			name: "Join",
			icon: 'plus',
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
			// route: "Select Account"
		  },
		  {
			name: "Invite",
			icon: 'people',
			params: {
			  type: 'exchange_account', image,
			  action: 'sell',
			  contractAddress: token.address, 
			  currencyName: token.name,
			  currencySymbol: token.symbol,
			  price: token.price
			},
			Component: SimpleLineIcons,
			// route: "Select Account"
		  }
		]

		navigation.setParams({ overrideHeader:
		  <TouchableWithoutFeedback onPress={()=>{}/*this.toggleMenu*/} style={{width:'100%', height:40}}> 
			  <View style={{
				  flexDirection: 'row',
				  alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
				  alignItems: 'center',
				  flex:1
			  }}>
				  <Image
					key={token.symbol}
					source={{ uri: image }}
					style={{width: 20, height: 20, borderRadius: 5 }}
				  />
				  <Text style={{color: '#fff', paddingHorizontal: 10, fontSize: 16 }}>
					  {token.name||token.symbol}
				  </Text>
				  {/*<SimpleLineIcons name={menuOpen ? 'arrow-up' : 'arrow-down'} color={'#fff'} />*/}
			  </View>
		  </TouchableWithoutFeedback>
		})
	}

	toggleMenu = () => {
		this.updateHeader()  
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
	}

	componentWillMount = async () => {
		try {
			const { navigation, userId } = this.props
			const { token } = navigation.state.params
			Backend.setRef(token.symbol)
			await Backend.authenticate(userId)
			this.updateHeader()
		} catch (err) {
			console.log(err)
		}
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

	renderMessage(props) {
		const { currentMessage: { text: currText } } = props;

		let messageTextStyle;

		// Make "pure emoji" messages much bigger than plain text.
		if (currText && emojiUtils.isPureEmojiString(currText)) {
			messageTextStyle = {
				fontSize: 28,
				// Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
				lineHeight: Platform.OS === 'android' ? 34 : 30,
			};
		}

		return (
			<Message {...props} messageTextStyle={messageTextStyle} />
		);
	}


	render() {
		const { username, avatar } = this.props
		const user = {
			_id: Backend.getUid(),
			name: username
		}
		if (avatar) {
			user.avatar = avatar
		}
		return (
			<View
				style={{
					flex: 1
				}}
			>
				<View style={{zIndex:2}}>
				  <Animated.View style={{
				  		height: this.state.menuHeight,
				  		overflow: 'hidden',
				  		position: 'absolute',
				  		width: '100%',
				  		zIndex: 2,
				  		top: 0,
				  		left: 0
				  }}>
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
					user={user}
					showUserAvatar={true}
					renderMessage={this.renderMessage}
				/>
				<KeyboardSpacer />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	avatar: state.account.avatar,
	username: state.account.username,
	userId: state.account.id,
	isBountyHunter: state.account.bountyHunter,
	...state.ui
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Chat));
