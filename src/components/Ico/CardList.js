import React, { Component } from "react"
import { Image, StyleSheet, FlatList, View, Text, Dimensions, TouchableOpacity } from "react-native"
import moment from "moment"
import { formatMoney } from "accounting"

class CardListItem extends Component {
	render() {
		const { startDate, goal, supply, name, logo, category, navigation } = this.props
		const instance = moment(startDate)
		const [month, day] = [instance.format("MMM"), instance.format("D")]
		return (
			<TouchableOpacity
				style={styles.cardRoot}
				onPress={() => navigation.navigate("ICODetail", { ico: this.props })}
			>
				<View
					style={{
						justifyContent: "space-between",
					}}
				>
					<Text
						style={[styles.baseText, { fontSize: 35 }]}
					>
						{String(day).padStart(2,0)}
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
						width: "45%",
					}}
				>
					<Text
						style={[styles.baseText, { fontSize: 18 }]}
					>{name}</Text>
					<Text
						style={[styles.baseText, { fontSize: 12 }]}
					>{(category || '').toUpperCase()}</Text>
					<Text
						style={[styles.baseText, { fontSize: 14 }]}
					>{formatMoney(goal, "$", 0)}</Text>
				</View>
				<Image
                    style={styles.logo}
                    source={{uri: `${logo}`}}
                />
			</TouchableOpacity>
		)
	}
}

export class CardList extends Component {
	render() {
		const { type, data, navigation } = this.props
		return (
			<View
				style={styles.cardListRoot}
			>
				<View
					style={[styles.topicHeight]}
				>
					<Text
						style={[styles.baseText, { fontFamily: 'Nunito' }]}
					>
						{type}
					</Text>
				</View>
				<FlatList
					renderItem={({ item }) => <CardListItem {...item} navigation={navigation} />}
					data={data}
					keyExtractor={(item) => item.id}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	cardRoot: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		width: Dimensions.get("window").width,
		borderColor: "rgba(255, 255, 255, .2)"
	},
	seperator: {
		height: "80%",
		width: 2,
		backgroundColor: "#fff",
		marginHorizontal: 20
	},
	baseText: {
		color: "#fff",
		fontFamily: 'Nunito-ExtraLight'
	},
	logo: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "#fff",
		marginLeft: 20
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
		backgroundColor: "#222",
	}
})
