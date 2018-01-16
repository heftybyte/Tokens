import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text, KeyboardAvoidingView, ScrollView } from "react-native"
import { Input, Form, Item, Label, Button, Content } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { observer } from "mobx-react"
import { NavigationActions } from 'react-navigation';
import { store } from './store'
import { Field } from "../lib/Field"
import Header from './header'
import Footer from './footer'
import { invitesEnabled } from '../../config'

export const Normal = observer(
	(navigation) => (
		<View
			style={{
				flex: 1,
				backgroundColor: '#000'
			}}
		>
			<Header title={store.type === 'normal' ? "Register" : "Login"} />
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
					{invitesEnabled && store.type === 'normal' &&
					<Field
						label="Invite Code"
						returnKeyType="next"
						onChange={v => store.changetext('code', v)}
						placeholder="q3frrdsd"
					/>}
					<Field
						label="Email"
						returnKeyType="next"
						value={store.getField('email')}
						onChange={v => store.changetext('email', v)}
						placeholder="e.g vitalik23"
					/>
					<Field
						label="Password"
						type="password"
						returnKeyType="next"
						onChange={v => store.changetext('password', v)}
						placeholder="*********"
					/>
				{store.type === 'normal' && 
					<Field
						label="Confirm Password"
						type="password"
						returnKeyType="done"
						onChange={v => store.changetext('cpassword', v)}
						placeholder="*********"
					/>}
					<Button onPress={store.type === 'normal' ? store.createAccount : store.login} style={styles.button} transparent>
						<Text style={{ color: '#fff' }}>{store.type === 'normal' ? 'CREATE AN ACCOUNT' : 'LOGIN'}</Text>
					</Button>
				</Content>
			</View>
			</KeyboardAvoidingView>
			<Footer toast={store.toast} />
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
		width: '92%',
		height: 45,
		paddingHorizontal: 15,
		marginTop: 10,
		backgroundColor: '#6b2fe2',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignSelf: 'center'
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
