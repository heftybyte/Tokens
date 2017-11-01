import React, { PureComponent } from "react"
import { View, TouchableOpacity, Text, Platform } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Drawer from "react-native-drawer"
import { observer } from "mobx-react/native"
import { Button, Header as NBHeader, Left, Body, Right, Content } from "native-base"
import { Constants } from 'expo'

import Header from "../components/Dashboard/Header"

const Items = [
	{
		name: "Account",
		icon: "account-circle",
		route: "Accounts"
	},
	{
		name: "Dashboard",
		icon: "apps",
		route: "Dashboard"
	}
]

export const withDrawer = (WrappedComponent) => {
	return class extends PureComponent {
		openDrawer = () => {
			this.drawer.open()
		}

		closeDrawer = () => {
			this.drawer.close()
		}
		render() {
			const { navigation, portfolio } = this.props
			const totalValue = portfolio.totalValue || 0

			return (
				<Drawer
					ref={d => (this.drawer = d)}
					type="overlay"
					openDrawerOffset={100}
					content={<DashboardMenu navigation={navigation} totalValue={totalValue} />}
					tapToClose
				>
					<Content style={{backgroundColor: '#000'}}>
						<NBHeader
						style={{
							backgroundColor: "#000", 
							borderBottomWidth: 0,
  							shadowOffset: { height: 0, width: 0 },
    						shadowOpacity: 0,
    						paddingTop: Platform.OS  === 'ios' ? 0 : Constants.statusBarHeight ,
    						height: 80
    					}}
						androidStatusBarColor="#000"
						noShadow
						>
							<Left>
								<Button
								style={{ justifyContent: "center", alignItems: "center", width: 60 }}
								transparent
								onPress={this.openDrawer}
								>
									<MaterialCommunityIcons
									name="menu"
									size={26}
									color="white"
									backgroundColor="black"
									/>
								</Button>
							</Left>
							<Body>
								<Text
									style={{
										color: '#fff',
										fontSize: 16,
										fontFamily: 'Nunito-ExtraLight',
									}}
								>
									{(navigation.state && navigation.state.routeName)}
								</Text>
							</Body>
							<Right>
								<Ionicons onClick={()=>{}} style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
							</Right>
						</NBHeader>
						<WrappedComponent {...this.props} />
					</Content>
				</Drawer>
			)
		}
	}
}

const DashboardMenu = ({ navigation, totalValue }) => (
	<View style={{flex: 1, backgroundColor: "#111"}}>
		<Header style={{paddingTop: 40}} totalValue={totalValue} />
		{Items.map(ListItem(navigation))}
	</View>
)

const ListItem = (navigation) => ({ name, route, icon }) => (
	<TouchableOpacity
		key={route}
		onPress={() => navigation.navigate(route)}
	>
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				paddingHorizontal: 10,
				alignItems: "center",
				height: 80,
			}}
		>
			<View style={{ width: 60 }}>
				<Icon name={icon} size={25} color="#fff" />
			</View>
			<View style={{ flex: 1 }}>
				<Text style={{ color: "#fff" }}>{name}</Text>
			</View>
		</View>
	</TouchableOpacity>
)