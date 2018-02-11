import React, { Component } from "react"
import { View } from "react-native"
import { withDrawer } from "../../helpers/drawer"
import { CardList } from "./CardList"
import { connect } from "react-redux"

const props = [{
	name: "Magenta Blockchain Service",
	supply: 3490000,
	startDate: 12263536735
},{
	name: "Magenta Blockchain Service",
	supply: 3490000,
	startDate: 12269536735
}]

@withDrawer
class ICOs_ extends Component {
	render() {
		const { navigation } = this.props
		return (
			<View
				style={{
					flex: 1,
				}}
			>
				<CardList
					type={"Featured"}
					data={props}
					navigation={navigation}
				/>
				<CardList
					type={"Active"}
					data={props}
					navigation={navigation}
				/>
				<CardList
					type={"Upcoming"}
					data={props}
					navigation={navigation}
				/>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	portfolio: state.account.portfolio
})

export const ICOs = connect(mapStateToProps)(ICOs_)
