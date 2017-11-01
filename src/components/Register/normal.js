import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text, KeyboardAvoidingView, ScrollView } from "react-native"
import { Input, Form, Item, Label, Button, Content } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { observer } from "mobx-react"
import { NavigationActions } from 'react-navigation';
import reduxStore from '../../store'
import { store } from './store'
import { Field } from "../lib/Field"
import Header from './header'

export const Normal = observer(
	(navigation) => (
		<View
			style={{
				flex: 1,
				backgroundColor: '#000',
				// justifyContent: 'space-between',
				// alignItems: 'center'
			}}
		>
			<Header title="Register" />
			<KeyboardAvoidingView
				style={{
					flex: 1
				}}
				behavior="padding"				
			>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 5,
				}}
			>
				<Content>
					<Field
						label="Invite Code"
						returnKeyType="next"
						onChange={v => store.changetext('inviteCode', v)}
						placeholder="q3frrdsd"
					/>
					<Field
						label="Email"
						returnKeyType="next"
						onChange={v => store.changetext('email', v)}
						placeholder="e.g vitalik@ethereum.org"
					/>
					<Field
						label="Password"
						type="password"
						returnKeyType="next"
						onChange={v => store.changetext('password', v)}
						placeholder="*********"
					/>
					<Field
						label="Confirm Password"
						type="password"
						returnKeyType="done"
						onChange={v => store.changetext('cpassword', v)}
						placeholder="*********"
					/>
					</Content>
			</View>
			</KeyboardAvoidingView>
			<View style={styles.bottomButton}>
				<View
					style={{
						marginRight: 10
					}}
				>
					<Button onPress={store.createAccount} style={styles.button} transparent>
						<Text style={{ color: '#fff' }}>CREATE AN ACCOUNT</Text>
					</Button>
				</View>
			</View>
		</View>
	)
)


const styles = {
	bottomButton: {
		flexDirection: 'row',
		height: 50,
		backgroundColor: '#6b2fe2',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	button: {
		height: 35,
		paddingHorizontal: 15,
	},
	input: {
		color: "#fff",
		paddingHorizontal: 5,
	},
	inputWrap: {
		marginVertical: 10,
		borderWidth: 0,
		borderRadius: 2,
		height: 80,
		backgroundColor: "#111",
		justifyContent: "center",
		alignItems: "center"
	},
	label: {
		marginVertical: 5,
		marginLeft: 5,
		color: "#eee"
	}
}
