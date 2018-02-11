import React, { Component } from "React"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import { View, Text, StyleSheet } from "react-native"
import { connect } from "react-redux"
import { Button } from "native-base"
import { formatMoney } from "accounting"
import { withDrawer } from "../../helpers/drawer"

@withDrawer
class ICODetail_ extends Component {
	render() {
		const {
			price = 3.57,
			video,
			image,
			supply = 137000000000,
			supplyOffered = "45%",
			name,
			symbol = "MGT",
			goal = 45000000,
			startDate,
			endDate } = this.props.navigation.state.params || {}
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
					<Text
						style={[
							styles.baseText,
							{ fontSize: 30 }
						]}
					>{formatMoney(price, "$", 2)}</Text>
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
						<Text style={[styles.baseText]}>Symbol</Text>

						<Text style={[styles.baseText, styles.subText]}>
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
						<Text style={[styles.baseText]}>Goal</Text>

						<Text style={[styles.baseText, styles.subText]}>
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
						<Text style={[styles.baseText]}>Supply</Text>

						<Text style={[styles.baseText, styles.subText]}>
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
						<Text style={[styles.baseText]}>Available</Text>

						<Text style={[styles.baseText, styles.subText]}>
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
						style={[
							styles.baseText,
							{ fontSize: 17 }
						]}
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
	subText: {
		fontSize: 22,
		width: "90%"
	}
})

const mapStateToProps = (state) => ({
	portfolio: state.account.portfolio
})

export const ICODetail = connect(mapStateToProps)(ICODetail_)
