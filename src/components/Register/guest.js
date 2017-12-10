import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text, KeyboardAvoidingView } from "react-native"
import { Input, Form, Item, Label, Button } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { store } from './store'
import { observer } from "mobx-react"
import { Field } from "../lib/Field"
import Header from './header'
import Footer from './footer'
import { invitesEnabled } from '../../config'

export const Guest = observer(
	(navigation)=> (
		<View style={{flex:1}}>
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
					backgroundColor: '#000',
					paddingHorizontal: 20,
				}}
			>
				{invitesEnabled && <Field
					label="Invite Code"
					returnKeyType="done"
					onChange={v => store.changetext('code', v)}
					placeholder="q3fV8dsd"
				/>}
				<Text style={[styles.text, { fontSize: 12, padding: 16, color: '#ff0000' }]}>
					WARNING: with guest mode you risk losing access to your account if this device is reset or lost.
				</Text>
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
			<Footer toast={store.toast} />
		</View>
	)
)

const copyToClipboard = async (key: string) => {
	try {
		await Clipboard.setString(key)
		// Toast Message: "Copied Key To Clipboard!"
	} catch (e) {
		//Could not store in clipboard!
	}
}

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
	text: {
		color: "#fff",

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