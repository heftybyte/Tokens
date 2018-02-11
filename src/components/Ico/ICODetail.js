import React, { Component } from "React"
import { View } from "react-native"
import { connect } from "react-redux"
import { withDrawer } from "../../helpers/drawer"

@withDrawer
class ICODetail_ extends Component {
	render() {
		const {
			price,
			video,
			image,
			supply,
			supplyOffered,
			name,
			symbol,
			startDate,
			endDate } = this.props.navation.state.params || {}
		return (
			<View
				style={{
					flex: 1,
				}}
			>
				<View
					style={{
						flexDirection: "row"
					}}
				>
					<Text></Text>
				</View>
			</View>
		)
	}
}


const mapStateToProps = (state) => ({
	portfolio: state.account.portfolio
})

export const ICODetail = connect(mapStateToProps)(ICODetail_)
