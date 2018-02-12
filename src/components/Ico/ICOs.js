import React, { Component } from "react"
import { ScrollView } from "react-native"
import { withDrawer } from "../../helpers/drawer"
import { CardList } from "./CardList"
import { connect } from "react-redux"

const props = [
	{
		name: "TomoCoin",
		supply: 100000000,
		startDate: 1519913420386,
		endDate: 1522588220386,
		price: 0.17,
		id: 380443432225,
		supplyOffered: 50,
		symbol: 'TMC',
		tokenId: 'tmc',
		category: 'Infrastructure',
		video: 'https://youtu.be/okTcuq9VsAA',
		website: 'https://tomocoin.io/',
		logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/01/TomoCoin-logo-150x150.jpg',
		goal: 8500000,
		description: 'An efficient blockchain infrastructure for decentralized applications, token issuance and integration.'

	},
	{
		name: "Lendroid",
		supply: 3490000,
		id: 782943452825,
		startDate: 1519913420386,
		endDate: 1522588220386,
		price: 0.0178,
		supplyOffered: '45%',
		category: 'Trading',
		symbol: 'LST',
		tokenId: 'lst',
		image: 'https://cdn.icodrops.com/wp-content/uploads/2018/01/Lendroid-banner-1.jpg',
		goal: 42800000,
		supplyOffered: 40,
		website: 'https://lendroid.com/?utm_source=icodrops',
		description: 'Lendroid is a 0x-inspired, non-rent seeking, trust-independent, open protocol enabling decentralized lending, margin trading and short selling on the Ethereum blockchain.',
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
