import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text } from "react-native"
import { Input, Form, Item, Label, Button } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { store } from './store'
import { observer } from "mobx-react"
import Header from './header'

export const Anonymous = observer(
	(navigation)=> (
		<View style={{flex:1}}>
			<Header title="Register" />
			<View
				style={{
					flex: 1,
					backgroundColor: '#000',
					justifyContent: 'center',
					alignContent: 'center',
					paddingVertical: 50,
					paddingHorizontal: 20,
				}}
			>
				<View
					style={{
						height: 400,
						flex: 1,
						backgroundColor: '#000',
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					<Image resizeMode='contain' style={{ height: 200, width: 200 }} source={require('./assets/qrcode.jpg')} />
				</View>
				<View>
					<Text style={[styles.text, { fontSize: 16, marginBottom: 5 }]}>Access Key</Text>
					<TouchableOpacity
						onPress={() => copyToClipboard(store.accessKey)}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: 'space-between',
								alignItems: "center",
								borderWidth: 1.5,
								paddingHorizontal: 10,
								height: 50,
								borderRadius: 6,
								borderColor: "#f00",
								marginBottom: 20,
							}}
						>
							<Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{store.accessKey}</Text>
							<Icon name="content-copy" size={25} color="#fff" />
						</View>
					</TouchableOpacity>
				</View>
				<Text style={[styles.text, { fontSize: 20 }]}>
					This is your access key, without it you will not be
					able to access your account. Save it in a safe place.
				</Text>
				<Form>
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