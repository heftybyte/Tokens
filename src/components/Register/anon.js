import React from "react"
import { View, Image, TouchableOpacity, Clipboard, Text } from "react-native"
import { Input, Form, Item, Label } from "native-base"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"

export const Anonymous = ({
	image = require("./assets/jpeg.jpg"),
	key = "b0554330-6ad9-4e00-839e-4645609b9fa1"
}) => (
	<View
		style={{
			flex: 1,
			backgroundColor: '#191f27',
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
				backgroundColor: '#191f27',
				justifyContent: 'center',
				alignContent: 'center'
			}}>
			<Image resizeMode='contain' style={{ height: 200, width: 200 }} source={image} />
		</View>
		<View>
			<Text style={[styles.text, { fontSize: 16, marginBottom: 5 }]}>Access Key</Text>
			<TouchableOpacity
				onPress={() => copyToClipboard(key)}
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
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{key}</Text>
					<Icon name="content-copy" size={25} color="#fff" />
				</View>
			</TouchableOpacity>
		</View>
		<Text style={[styles.text, { fontSize: 20 }]}>
			This is your access key, without it you will not be
			able to access your account. Save it in a safe place.
		</Text>
	</View>
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
	text: {
		color: "#fff",

	}
}