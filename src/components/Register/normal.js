import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text } from "react-native"
import { Input, Form, Item, Label, Button } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { observer } from "mobx-react"

import { store } from './store'

export const Normal = observer(
	() => (
		<View
			style={{
				flex: 1,
				backgroundColor: '#191f27',
				// justifyContent: 'space-between',
				// alignItems: 'center'
			}}
		>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<Form>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Username</Label>
						<Input onChangeText={v => store.changetext('username', v)} style={styles.input} />
					</Item>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Password</Label>
						<Input onChangeText={v => store.changetext('password', v)} style={styles.input} />
					</Item>
					<Item style={styles.inputWrap} floatingLabel regular>
						<Label style={styles.label}>Confirm Password</Label>
						<Input onChangeText={v => store.changetext('cpassword', v)} style={styles.input} />
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
		borderWidth: 0,
		borderRadius: 2,
		height: 80,
		backgroundColor: "#1e2631",
		justifyContent: "center",
		alignItems: "center"
	},
	label: {
		marginTop: 5,
		marginLeft: 5,
		color: "#eee"
	}
}
