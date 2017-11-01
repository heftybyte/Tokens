import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text, KeyboardAvoidingView, ScrollView } from "react-native"
import { Input, Form, Item, Label, Button, Content } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { observer } from "mobx-react"

import { store } from './store'
import { Field } from "../lib/Field"

export const Normal = observer(
	(navigation) => (
		<View
			style={{
				flex: 1,
				backgroundColor: '#191f27',
				// justifyContent: 'space-between',
				// alignItems: 'center'
			}}
		>
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
						label="Username"
						returnKeyType="next"
						onChange={v => store.changetext('username', v)}
						/* value={this.store.fields.bankAccountName} */
						placeholder="e.g JohnDoe123"
					/>
					<Field
						label="Password"
						returnKeyType="next"
						onChange={v => store.changetext('password', v)}
						/* value={this.store.fields.bankAccountName} */
						placeholder="*********"
					/>
					<Field
						label="Confirm Password"
						returnKeyType="done"
						onChange={v => store.changetext('cpassword', v)}
						/* value={this.store.fields.bankAccountName} */
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
		backgroundColor: '#e76f22',
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
		backgroundColor: "#1e2631",
		justifyContent: "center",
		alignItems: "center"
	},
	label: {
		marginVertical: 5,
		marginLeft: 5,
		color: "#eee"
	}
}
