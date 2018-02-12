import React, { Component } from "React"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { View, Text, StyleSheet } from "react-native"
import { connect } from "react-redux"
import { Button } from "native-base"
import { formatMoney } from "accounting"
import { withDrawer } from "../../helpers/drawer"
import { formatPrice } from '../../helpers/functions'

const tokenMetaStyle = v => v.toString().length > 8 ? styles.tokenMetaWrapped : styles.tokenMeta

@withDrawer
class ICODetail_ extends Component {
	render() {
		const {
			ico:{
				price = 3.57,
				video,
				image,
				whitelistLink,
				supply = 137000000,
				supplyOffered = "45%",
				name,
				symbol = "MGT",
				goal = 45000000,
				startDate,
				endDate 
			}
		} = this.props.navigation.state.params || {}
		const valueParts = formatPrice(price).split(/\$|\./)
		return (
			<View
				style={{
					flex: 1,
					marginHorizontal: 20
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						height: 80,
					}}
				>
					<Text>
						<Text style={styles.tokenValueCurrencySymbol}>$</Text>
						<Text style={styles.tokenValue}>{valueParts[0]}</Text>
						<Text style={styles.tokenValueCents}>.{valueParts[1]||'00'}</Text>
					</Text>
				</View>
				<View
					style={{
						backgroundColor: "#fff",
						width: "100%",
						height: 200
					}}
				/>
				<View
					style={{
						flexDirection: "row",
						marginVertical: 10
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "space-between",
							height: 50
						}}
					>
						<Text style={styles.headingText}>SYMBOL</Text>

						<Text style={styles.tokenMeta}>
							{symbol}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "space-between",
							height: 50
						}}
					>
						<Text style={styles.headingText}>GOAL</Text>

						<Text style={tokenMetaStyle(goal)}>
							{formatMoney(goal, "$", 0)}
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						marginVertical: 10
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "space-between",
							height: 50
						}}
					>
						<Text style={styles.headingText}>SUPPLY</Text>

						<Text style={tokenMetaStyle(supply)}>
							{formatMoney(supply, "", 0)}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: "space-between",
							height: 50
						}}
					>
						<Text style={styles.headingText}>AVAILABLE</Text>

						<Text style={styles.tokenMeta}>
							{supplyOffered}
						</Text>
					</View>
				</View>
				<Button
					block
					transparent
					style={{
						justifyContent: "space-between",
						marginTop: 30,
						width: "100%"
					}}
				>
					<Text
						style={[styles.tokenMeta, { fontSize: 17 }]}
					>
						JOIN WHITELIST
					</Text>
					<Icon
						name={"chevron-right"}
						size={25}
						color={"#fff"}
					/>
				</Button>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	baseText: {
		color: "#fff"
	},
	tokenValueCurrencySymbol: {
		color: '#fff',
		fontSize: 30,
		fontFamily: 'Nunito-ExtraLight'
	},
	tokenValue: {
		color: '#fff',
		fontSize: 60,
		fontFamily: 'Nunito-ExtraLight'
	},
	tokenValueCents: {
		color: '#fff',
		fontSize: 30,
		fontFamily: 'Nunito-ExtraLight'
	},
	headingText: {
		color: '#666',
		fontFamily: 'Nunito'
	},
	tokenMeta: {
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Nunito',
	},
	tokenMetaWrapped: {
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Nunito',
		width: 150
	},
	subText: {
		fontSize: 22,
		width: "90%"
	}
})

const mapStateToProps = (state) => ({
	portfolio: state.account.portfolio
})

export const ICODetail = connect(mapStateToProps)(ICODetail_)
