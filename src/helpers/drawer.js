import React, { PureComponent } from "react"
import { View, TouchableHighlight, Text, Platform, Alert, Image, Dimensions, StatusBar } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import Drawer from "react-native-drawer"
import { observer } from "mobx-react/native"
import { Button, Header as NBHeader, Left, Body, Right, Content } from "native-base"
import { Constants } from 'expo'
import Spinner from 'react-native-loading-spinner-overlay';
import { getTokenImage } from '../helpers/functions'
import { trackTap } from '../helpers/analytics'
import Header from "../components/Dashboard/Header"
import Toast, { DURATION } from 'react-native-easy-toast'
import store from '../store'
import { NavigationActions } from "react-navigation";
import { baseAccent, baseColor, brandColor, baseURL } from '../config'
import { shareTokenDetails } from './functions'

const Items = [
    {
        name: "Dashboard",
        icon: "pie-chart",
        route: "Dashboard",
        Component: SimpleLineIcons
    },
    {
        name: "Wallets",
        icon: "wallet",
        route: "Wallet",
        Component: SimpleLineIcons,
    },
    {
        name: "Exchanges",
        icon: "chart",
        route: "Exchanges",
        Component: SimpleLineIcons
    },
    {
        name: "Addresses",
        icon: "notebook",
        route: "Accounts",
        Component: SimpleLineIcons
    },
	/*
    {
        name: "Chat",
        icon: "account-circle",
        route: "Chat"
    },
    {
		name: "ICO List",
		icon: "fire",
		route: "ICO List",
		Component: MaterialCommunityIcons,
		color: '#ff0000'
	},
    {
        name: "Bookmarks",
        icon: "bookmark",
        route: "Bookmarks"
    }*/
    {
      name: "Edit Profile",
      icon: "edit",
      route: "Edit Profile"
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
        componentWillReceiveProps = (nextProps) => {
            const { toast, toastDuration } = nextProps
            if (toast && this.refs.toast) {
                this.refs.toast.show(toast, toastDuration)
            }
        }
        render() {
            const { navigation, portfolio } = this.props
            const totalValue = portfolio.totalValue || 0
            const { state: navState } = navigation
            const headerText = navState &&
                navState.params && navState.params.overrideHeaderText ||
                navState.routeName
            const toastProps = store && store.getState().ui.toastProps || {}
            const isTokenDetails = navState.routeName === 'Token Details' || navState.routeName === 'Price Alert'
            const tokenDetails = navState.params && navState.params.token || {}
            const isICOdetails = navState.routeName === 'ICODetail'
	        const icoDetails = navState.params && navState.params.ico || {}
            // Remove after: https://app.asana.com/0/425477633452716/477358357686745
            const showBackButton = [
                'Token Details', 'Search', 'Price Alert', 'Add Address',
                'ICO List', 'ICODetail', 'Education', 'Restore Wallet', 'New Wallet', 'Confirm Phrase'
            ].indexOf(navState.routeName) > -1

            const noSearchButton = [
                'Restore Wallet', 'New Wallet', 'Confirm Phrase'
            ].indexOf(navState.routeName) > -1

            // add top padding for iphone X
            const isIos = Platform.OS === 'ios';
            const isIphoneX = isIos && Dimensions.get('window').height === 812;
            const iphoneHeaderHeight = isIphoneX ? 30 : 0;

            return (
                <Drawer
                    ref={d => (this.drawer = d)}
                    type="overlay"
                    openDrawerOffset={100}
                    content={<DashboardMenu navigation={navigation} totalValue={totalValue} />}
                    tapToClose
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: baseColor
                        }}
                    >
                        <NBHeader
                        style={{
                            backgroundColor: baseColor,
                            borderBottomWidth: 0,
                            shadowOffset: { height: 0, width: 0 },
                            shadowOpacity: 0,
                            paddingTop: Platform.OS  === 'ios' ? iphoneHeaderHeight : Constants.statusBarHeight ,
                            height: 80
                        }}
                        androidStatusBarColor={baseColor}
                        noShadow
                        >
                            <Left style={
                                Platform.OS === 'ios' ? {} : {flex: .4}
                            }>
                                <Button
                                style={{
                                    justifyContent: "center",
                                    alignItems: Platform.OS === 'ios' ? "center" : "flex-start",
                                    width: 60,
                                }}
                                transparent
                                onPress={ showBackButton ?
                                    ()=>{trackTap('Menu:Back'); store.dispatch(NavigationActions.back())} :
                                    ()=>{trackTap('Menu'); this.openDrawer()}
                                }>
                                    {showBackButton ?
                                        <Ionicons
                                            name={Platform.OS === 'ios' ? "ios-arrow-back" : "md-arrow-back"}
                                            size={26}
                                            color="white"
                                            backgroundColor="black"
                                            /> :
                                        <MaterialCommunityIcons
                                            name="menu"
                                            size={26}
                                            color="white"
                                            backgroundColor="black"
                                            />}
                                </Button>
                            </Left>
                            <Body>
                                {isTokenDetails ? (
                                    <View style={{
                                        flexDirection: 'row',
                                        alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
                                        alignItems: 'center',
                                        flex:1
                                    }}>
                                        <Image
	                                        key={tokenDetails.symbol}
	                                        source={{ uri: getTokenImage(tokenDetails.id) }}
	                                        style={{width: 20, height: 20, borderRadius: 5}}
                                        />
                                        <Text style={{color: '#fff', paddingLeft: 10}}>
                                            {tokenDetails.name||tokenDetails.symbol}
                                        </Text>
                                    </View>
	                                ) : isICOdetails ? (
	                                <View style={{
		                                flexDirection: 'row',
		                                alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
		                                alignItems: 'center',
		                                flex:1
	                                }}>
		                                <Image
			                                key={icoDetails.symbol}
			                                source={{ uri: getTokenImage(icoDetails.tokenId) }}
			                                style={{width: 20, height: 20, borderRadius: 5}}
		                                />
		                                <Text style={{color: '#fff', paddingLeft: 10}}>
			                                {icoDetails.name.split(" ")[0]}
		                                </Text>
	                                </View>
	                                ) : (
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            fontFamily: 'Nunito-ExtraLight',
                                        }}
                                    >
                                        {headerText}
                                    </Text>
                                )}
                            </Body>
                            <Right>
                            {(false && isTokenDetails) ?
                                <TouchableHighlight
                                    style={{ justifyContent: "center", alignItems: "center", width: 60 }}
                                    onPress={()=>{shareTokenDetails(tokenDetails.symbol)}}
                                >
                                    <Ionicons name="ios-share" size={28} color="white" />
                                </TouchableHighlight>
                                :
                                (!noSearchButton) ?
                                    <Button
                                        style={{ justifyContent: "center", alignItems: "center", width: 60 }}
                                        transparent
                                        onPress={()=>{trackTap('Search');navigation.dispatch({type: 'Search'})}}
                                    >
                                        <Ionicons name="ios-search-outline" size={28} color="white" />
                                    </Button>
                                :
                                    false
                            }
                            </Right>
                        </NBHeader>
                        <Spinner
                            visible={false}
                            textContent={this.props.loadText||''}
                            textStyle={{color: '#FFF', fontSize: 16}}
                            overlayColor='rgba(0,0,0,.9)'
                        />
                        <WrappedComponent {...this.props} />
                        <Toast
                            ref="toast"
                            style={{backgroundColor:'#111'}}
                            {...toastProps}
                        />
                    </View>
                </Drawer>
            )
        }
    }
}

const DashboardMenu = ({ navigation, totalValue }) => (
    <View style={{
        flex: 1,
        backgroundColor: baseColor,
        paddingTop: 40,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowOffset: {width: 2, height: 1},
        shadowRadius: 20
    }}>
        <StatusBar barStyle="light-content" />
        <View style={{ borderBottomWidth: 2, borderColor: baseAccent, alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Menu</Text>
        </View>
        {Items.map(ListItem(navigation))}
    </View>
)

const ListItem = (navigation) => ({ name, route, icon, Component, color }) => (
    <TouchableHighlight
        key={route}
        onPress={() => navigation.navigate(route)}
    >
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                alignItems: "center",
                paddingLeft: 25,
                height: 75,
            }}
        >
            <View style={{ width: 60 }}>
	            {
		            Component ? (
		            	<Component name={icon} size={20} color={color || brandColor} />
		            ) : (
			            <Icon name={icon} size={20} color={color || brandColor} />
		            )
	            }
            </View>
            <View style={{ flex: .9 }}>
                <Text style={{ color: "#fff" }}>{name}</Text>
            </View>
            <View style={{ flex: .1 }}>
                <SimpleLineIcons name={'arrow-right'} color="#fff" size={14} />
            </View>
        </View>
    </TouchableHighlight>
)
