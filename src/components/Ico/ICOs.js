import React, { Component } from "react"
import { ScrollView } from "react-native"
import { withDrawer } from "../../helpers/drawer"
import { CardList } from "./CardList"
import { connect } from "react-redux"

const props = [
	{
		name: "Metronome",
		supply: 137000000,
		startDate: 12263536735,
		supplyOffered: '45%',
		symbol: 'MTL',
		tokenId: 'tnt',
		logo: 'https://cdn.icodrops.com/wp-content/uploads/2017/10/Metronome-150x150.jpg',
		goal: 47000000,

	},
	{
		name: "Lendroid",
		supply: 3490000,
		startDate: 12263536735,
		supplyOffered: '45%',
		symbol: 'MGT',
		goal: 45000000,
		logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/01/Lendroid-logo-150x150.jpg'
		
	}
]

@withDrawer
class ICOs_ extends Component {
	render() {
		const { navigation } = this.props
		return (
			<ScrollView
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
			</ScrollView>
		)
	}
}

const mapStateToProps = (state) => ({
	portfolio: state.account.portfolio
})

export const ICOs = connect(mapStateToProps)(ICOs_)
