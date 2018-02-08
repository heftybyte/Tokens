import React, { Component } from "react"
import { StyleSheet, FlatList, View, Text, Dimensions } from "react-native"
import moment from "moment"
import { formatMoney } from "accounting"

class CardListItem extends Component {
	render() {
		const { startDate, supply, name } = this.props
		const instance = moment(startDate)
		const [month, day] = [instance.format("MMM"), instance.format("D")]
		return (
			<View style={styles.cardRoot}>
				<View
					style={{
						justifyContent: "space-between",
					}}
				>
					<Text
						style={[styles.baseText, { fontSize: 35 }]}
					>
						{day}
					</Text>
					<Text
						style={[styles.baseText, { fontSize: 20 }]}
					>
						{month.toUpperCase()}
					</Text>
				</View>
				<View style={styles.seperator} />
				<View
					style={{
						width: "30%"
					}}
				>
					<Text
						style={[styles.baseText, { fontSize: 16 }]}
					>{name}</Text>
					<Text
						style={[styles.baseText, { fontSize: 14 }]}
					>{formatMoney(supply, "$", 0)}</Text>
				</View>
				<View
					style={styles.circle}
				/>
			</View>
		)
	}
}

export class CardList extends Component {
	render() {
		const { type } = this.props
		return (
			<View
				style={styles.cardListRoot}
			>
				<View
					style={[styles.topicHeight]}
				>
					<Text
						style={[styles.baseText]}
					>
						{type}
					</Text>
				</View>
				<FlatList
					horizontal
					renderItem={({ item }) => <CardListItem {...item} />}
					data={[{
						name: "Magenta Blockchain Service",
						supply: 3490000,
						startDate: 12263536735
					},{
						name: "Magenta Blockchain Service",
						supply: 3490000,
						startDate: 12269536735
					}]}
					keyExtractor={(item) => item.startDate}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	cardRoot: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		width: "100%",
		borderColor: "rgba(255, 255, 255, .2)"
	},
	seperator: {
		height: "80%",
		width: 2,
		backgroundColor: "#fff",
		marginHorizontal: 20
	},
	baseText: {
		color: "#fff"
	},
	circle: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "#fff"
	},
	cardListRoot: {
		height: 120,
		width: "100%",
	},
	topicHeight: {
		height: 30,
		justifyContent: "center",
		alignItems: "flex-start",
		paddingHorizontal: 20,
		backgroundColor: "#555"
	}
})
