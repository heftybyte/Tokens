import React from "react"
import { Platform, Text } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, Left, Button, Body, Right } from "native-base"
import { NavigationActions } from 'react-navigation'
import reduxStore from '../../store'
import { Constants } from 'expo'

export default (props) => (
	<Header
		style={{
			backgroundColor: "#000", 
			borderBottomWidth: 0,
			shadowOffset: { height: 0, width: 0 },
			shadowOpacity: 0,
			paddingTop: Platform.OS  === 'ios' ? 0 : Constants.statusBarHeight ,
			height: 80
		}}
		androidStatusBarColor="#000"
		noShadow
	>
		<Left>
			<Button
			style={{ justifyContent: "center", alignItems: "center", width: 60 }}
			transparent
			onPress={()=>reduxStore.dispatch(NavigationActions.back())}
			>
				{Platform.OS === 'ios'?
				<Ionicons
					name="ios-arrow-back"
					size={26}
					color="white"
					backgroundColor="black"
					/>
				:
				<MaterialCommunityIcons
				name="arrow-left"
				size={26}
				color="white"
				backgroundColor="black"
				/>
			}
			</Button>
		</Left>
		<Body>
			<Text
			style={{
				color: '#fff',
				fontSize: 16,
				fontFamily: 'Nunito-ExtraLight'
			}}>
				{props.title}
			</Text>
		</Body>
		<Right />
	</Header>
)