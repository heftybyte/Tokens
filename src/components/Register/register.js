import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { Button } from "native-base"
import React from "react"
import { observer } from "mobx-react"

import { store } from "./store"

const radioStyles = {
	outer: (size, outerColor) => ({
		borderRadius: size / 2,
		height: size,
		width: size,
		borderWidth: 3,
		borderColor: outerColor,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center'
	}),
	inner: (size,  innerColor) => ({
		height: size - 12,
		width: size - 12,
		borderRadius: (size - 12) / 2,
		backgroundColor: innerColor
	})
}

const RadioButton = observer(
	({ selected, size, innerColor, outerColor }) => (
		<View
			style={radioStyles.outer(size,  outerColor)}
		>
			{selected && <View style={radioStyles.inner(size, innerColor)} />}
		</View>
	)
)

const Register = observer(
	({ navigation }) => (
		<View
			style={{
				flex: 1,
				backgroundColor: '#191f27'
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<View style={{ flex: 1, height: 150, paddingVertical: 30 }}>
					<Image resizeMode='contain' style={{flex: 1}} source={require("./assets/Tokens_Icon.png")} />
				</View>
				<View style={styles.itemWrapper}>
					<TouchableOpacity
						onPress={() => store.changeType("normal")}
					>
						<View style={styles.item}>
							<RadioButton
								selected={store.type === "normal"}
								outerColor={'#fff'}
								innerColor={'#e76f22'}
								size={25}
							/>
							<View style={{flex: 1, paddingLeft: 10}}>
								<Text style={styles.text}>CREATE NORMAL ACCOUNT</Text>
							</View>
							<Icon name="information-outline" size={25} color="#fff" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => store.changeType("anon")}
					>
						<View style={styles.item}>
							<RadioButton
								selected={store.type === "anon"}
								outerColor={'#fff'}
								innerColor={'#e76f22'}
								size={25}
							/>
							<View style={{flex: 1, paddingLeft: 10}}>
								<Text style={styles.text}>CREATE ANONYMOUS ACCOUNT</Text>
							</View>
							<Icon name="information-outline" size={25} color="#fff" />
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.bottomButton}>
				<View
					style={{
						marginRight: 10
					}}
				>
					<Button onPress={() => store.navigate(navigation)} style={styles.button} transparent>
						<Text style={{ color: '#fff' }}>CONTINUE</Text>
					</Button>
				</View>
			</View>
		</View>
	)
)

const styles = {
	screenWrap: {
		justifyContent: 'space-between'
	},
	button: {
		height: 35,
		paddingHorizontal: 15,
	},
	bottomButton: {
		flexDirection: 'row',
		height: 50,
		backgroundColor: '#e76f22',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10,
		height: 70,
		width: Dimensions.get('window').width - 20,
		backgroundColor: '#1e2631',
		alignItems: 'center'
	},
	itemWrapper: {
		elevation: 2,
		flex: 1,
		height: 200,
		alignContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '100',
	}
}

export default Register