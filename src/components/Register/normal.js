import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text, Platform } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Input, Form, Item, Label, Button, Left } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { observer } from "mobx-react"
import { NavigationActions } from 'react-navigation';
import reduxStore from '../../store'
import { store } from './store'
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
			<View
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<Form>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Email</Label>
						<Input keyboardType='email-address' onChangeText={v => store.changetext('email', v)} style={styles.input} />
					</Item>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Password</Label>
						<Input secureTextEntry={true} onChangeText={v => store.changetext('password', v)} style={styles.input} />
					</Item>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Confirm Password</Label>
						<Input secureTextEntry={true} onChangeText={v => store.changetext('cpassword', v)} style={styles.input} />
					</Item>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Invite Code</Label>
						<Input onChangeText={v => store.inviteCode =  v} style={styles.input} />
					</Item>
				</Form>
			</View>
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
		borderWidth: 0,
		borderRadius: 2,
		height: 80,
		backgroundColor: "#111",
		justifyContent: "center",
		alignItems: "center"
	},
	label: {
		marginTop: 5,
		marginLeft: 5,
		color: "#eee"
	}
}
