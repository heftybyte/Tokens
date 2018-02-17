import React, { Component } from "react"
import { ScrollView } from "react-native"
import { withDrawer } from "../../helpers/drawer"
import { CardList } from "./CardList"
import { connect } from "react-redux"

const icos = {
	"featured": [
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
			supply: 12000000000,
			id: 782943452825,
			startDate: 1487480400000,
			endDate: 1489896000000,
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
	],
	"active": [
		{
			name: "FintruX",
			supply: 100000000,
			startDate: 1486443600000,
			endDate: 1488258000000,
			price: 0.58,
			id: 480443432225,
			supplyOffered: 75,
			symbol: 'FTX',
			tokenId: 'ftx',
			category: 'Finance',
			whitelistLink: 'https://www.fintrux.com/register.aspx?ReturnUrl=%2ftokensale.aspx',
			video: 'https://youtu.be/1bRa4nPxi9s',
			website: 'https://www.fintrux.com/?utm_source=icodrops',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/01/FintruX-logo-150x150.jpg',
			goal: 25000000,
			description: 'The Global P2P Lending ecosystem powered by ethereum and no-code development.'
		},
		{
			name: "Bankera",
			supply: 25000000000,
			startDate: 1511758800000,
			endDate: 1519794000000,
			price: 0.0213,
			id: 880443432225,
			supplyOffered: 50,
			symbol: 'BNK',
			tokenId: 'bnk',
			category: 'Banking',
			video: 'https://youtu.be/b5osUZCFuBE',
			website: 'http://bankera.com',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2017/08/q8wup7Tl_400x400-150x150.jpg',
			goal: 221400000,
			description: 'Bankera is building a digital bank to last for the blockchain era.'
		},
		{
			name: "Socialmedia.market",
			supply: 50000000,
			startDate: 1518152400000,
			endDate: 1521172800000,
			price: 0.17,
			id: 980443432225,
			supplyOffered: 80,
			symbol: 'SMT',
			tokenId: 'smt',
			category: 'Marketing',
			video: 'https://youtu.be/Gu8zmFF_MIc',
			website: 'https://socialmedia.market',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2017/12/edO4-DCs_400x400-150x150.jpg',
			goal: 14000000,
			description: 'SocialMedia.Market – the first decentralized ecosystem to discover, create, perform and analyze advertising campaigns with social media influencers.'
		}
	],
	"upcoming": [
		{
			name: "Sentinel Chain",
			supply: 500000000,
			startDate: 1521086400000,
			endDate: 1523764800000,
			price: 0.072,
			id: 658443432225,
			supplyOffered: 40,
			symbol: 'SENC',
			tokenId: 'senc',
			category: 'Marketplace',
			video: 'https://youtu.be/uGWUtP_cl-4',
			website: 'https://sentinel-chain.org/',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/02/Sentinel-chain-logo-150x150.jpg',
			goal: 14400000,
			description: 'The Sentinel Chain is a B2B marketplace specifically designed to provide affordable and secure financial services to the unbanked.'
		},
		{
			name: "Sapien Network",
			supply: 500000000,
			startDate: 1520053200000,
			endDate: 1522728000000,
			price: 0.11,
			id: 894443432225,
			supplyOffered: 50,
			symbol: 'SPN',
			tokenId: 'spn',
			category: 'Social Network',
			video: 'https://www.youtube.com/watch?v=LMXq-_bAs5g',
			website: 'https://www.sapien.network',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/01/Sapien-logo-150x150.jpg',
			goal: 30000000,
			description: 'A customizable and privacy-focused, decentralized social news platform.'
		},
		{
			name: "Havven",
			supply: 100000000,
			startDate: 1519794000000,
			endDate: 1520312400000,
			price: 0.50,
			id: 893443432225,
			supplyOffered: 50,
			symbol: 'HAVVEN',
			tokenId: 'HAVVEN',
			category: 'Currency',
			image: 'https://cdn.icodrops.com/wp-content/uploads/2018/02/Havven-banner.jpg',
			website: 'https://havven.io/token-sale',
			logo: 'https://cdn.icodrops.com/wp-content/uploads/2018/02/Havven-logo-150x150.jpg',
			goal: 30000000,
			description: 'Havven is a decentralised payment network and stablecoin. It allows anyone to transact using a stable cryptocurrency.'
		}
	]
}

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
					data={icos.featured}
					navigation={navigation}
				/>
				<CardList
					type={"Active"}
					data={icos.active}
					navigation={navigation}
				/>
				<CardList
					type={"Upcoming"}
					data={icos.upcoming}
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
