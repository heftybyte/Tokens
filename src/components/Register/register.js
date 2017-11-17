import { Alert, View, Text, Dimensions, Image, TouchableOpacity } from "react-native"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { Button } from "native-base"
import React from "react"
import { observer } from "mobx-react"
import Footer from './footer'
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
				backgroundColor: '#000'
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Image resizeMode='contain' style={{height: '40%', width: '40%',flex: 1}} source={require("./assets/Tokens_Icon.png")} />
				<View style={styles.itemWrapper}>
					<TouchableOpacity
						onPress={() => store.changeType("normal")}
					>
						<View style={styles.item}>
							<RadioButton
								selected={store.type === "normal"}
								outerColor={'#fff'}
								innerColor={store.type === "normal" ? '#6b2fe2' : '#111'}
								size={25}
							/>
							<View style={{flex: 1, paddingLeft: 10}}>
								<Text style={styles.text}>CREATE ACCOUNT</Text>
							</View>
							<Icon name="information-outline" size={25} color="#fff" onPress={()=>Alert.alert('Access your account from other devices')} />
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => store.changeType("guest")}
					>
						<View style={styles.item}>
							<RadioButton
								selected={store.type === "guest"}
								outerColor={'#fff'}
								innerColor={ store.type === "guest" ? '#6b2fe2' : '#111'}
								size={25}
							/>
							<View style={{flex: 1, paddingLeft: 10}}>
								<Text style={styles.text}>GUEST MODE</Text>
							</View>
							<Icon name="information-outline" size={25} color="#fff" onPress={()=>Alert.alert('Account dedicated to this device only')}/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => store.changeType("login")}
					>
						<View style={styles.item}>
							<RadioButton
								selected={store.type === "login"}
								outerColor={'#fff'}
								innerColor={store.type === "login" ? '#6b2fe2' : '#111'}
								size={25}
							/>
							<View style={{flex: 1, paddingLeft: 10}}>
								<Text style={styles.text}>LOGIN</Text>
							</View>
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
						<Text style={{ color: '#fff', fontFamily: 'Nunito' }}>CONTINUE</Text>
					</Button>
				</View>
			</View>
			<Footer toast={store.toast} />
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
		backgroundColor: '#6b2fe2',
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
		backgroundColor: '#111',
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
		fontFamily: 'Nunito'
	}
}

export default Register