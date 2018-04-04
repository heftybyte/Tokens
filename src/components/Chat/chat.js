/*
  Created By Seun LanLege
  1:53 PM 15 Thu Mar 2018
*/
import React from "react"
import { View } from "react-native"
import { GiftedChat } from 'react-native-gifted-chat'
import KeyboardSPacer from "react-native-keyboard-spacer"

export class Chat extends React.Component {
	state = {
		messages: [],
	}

	componentWillMount() {
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://facebook.github.io/react/img/logo_og.png',
					},
				},
			],
		})
	}

	onSend = (messages = []) => {
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}))
	}

	render() {
		return (
			<View
				style={{
					flex: 1
				}}
			>
				<GiftedChat
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: 1,
					}}
				/>
				<KeyboardSPacer />
			</View>
		)
	}
}
