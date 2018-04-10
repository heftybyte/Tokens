import React, { PureComponent } from "react"
import { View, TouchableWithoutFeedback, Text, Platform, Alert, Image, Dimensions, StatusBar } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import Drawer from "react-native-drawer"
import { Button, Header as NBHeader, Left, Body, Right, Content } from "native-base"
import { Constants } from 'expo'
import Spinner from 'react-native-loading-spinner-overlay';
import { getTokenImage } from '../helpers/functions'
import { trackTap } from '../helpers/analytics'
import Toast, { DURATION } from 'react-native-easy-toast'
import store from '../store'
import { NavigationActions } from "react-navigation";
import { baseAccent, baseColor, brandColor, baseURL } from '../config'
import { shareTokenDetails } from './functions'
import { Menu } from '../components/Common/Menu'

const Items = [
    {
        name: "Portfolio",
        icon: "pie-chart",
        route: "Profile",
        Component: SimpleLineIcons
    },
    {
        name: "Chat",
        icon: "bubbles",
        route: "Chat",
        Component: SimpleLineIcons
    },
    {
        name: "Wallets",
        icon: "wallet",
        route: "AccountType",
        params: { type: 'wallet' },
        Component: SimpleLineIcons
    },
    {
        name: "Exchanges",
        icon: "chart",
        route: "AccountType",
        params: { type: 'exchange_account' },
        Component: SimpleLineIcons
    },
    {
        name: "Addresses",
        icon: "notebook",
        params: { type: 'address' },
        route: "AccountType",
        Component: SimpleLineIcons
    },
    {
        name: "Settings",
        icon: "settings",
        route: "Settings",
        Component: SimpleLineIcons
    }/*,
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
    }
    {
      name: "Edit Profile",
      icon: "edit",
      route: "Edit Profile"
    }
    */
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

        getHeaderBody = () => {
            const { navigation } = this.props
            const { state: navState } = navigation

            if (navState.params && navState.params.overrideHeader) {
                return navState.params.overrideHeader
            }

            switch(navState.routeName) {
                case 'ICODetail':
                    const icoDetails = navState.params && navState.params.ico || {}
                    return (
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
                    )
                case 'Token Details':
                case 'Price Alert':
                default:
                    let headerText, fontSize = 16
                    if (navState.params && navState.params.overrideHeaderText) {
                        headerText = navState.params.overrideHeaderText
                    } else if (WrappedComponent.getHeader) {
                        return WrappedComponent.getHeader(navState)
                    } else if (WrappedComponent.getHeaderText) {
                        headerText = WrappedComponent.getHeaderText(navState)
                    } else if (WrappedComponent.headerText) {
                        headerText = WrappedComponent.headerText
                    }else {
                        headerText = navState.routeName
                    }
                    if (headerText.length >= 14) {
                        fontSize = 13
                    } else if (headerText.length >= 10) {
                        fontSize = 14
                    }
                    return (
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: fontSize,
                                fontFamily: 'Nunito-ExtraLight',
                            }}
                        >
                            {headerText}
                        </Text>
                    )
            }
        }

        render() {
            const { navigation, portfolio } = this.props
            const { state: navState } = navigation
            const hideHeader = !!WrappedComponent.hideHeader
            const headerBody = hideHeader ? null : this.getHeaderBody()
            const toastProps = store && store.getState().ui.toastProps || {}
            const isTokenDetails = navState.routeName === 'Token Details' || navState.routeName === 'Price Alert'
            const tokenDetails = navState.params && navState.params.token || {}
            // Remove after: https://app.asana.com/0/425477633452716/477358357686745
            const showBackButton = [
                'Token Details', 'Search', 'Price Alert', 'Add Address',
                'ICO List', 'ICODetail', 'Education', 'Restore Wallet', 'New Wallet', 'Confirm Phrase', 'SetPin',
                'SecuritySettings', 'Select Account', 'SendTransaction', 'Edit Profile', 'NewExchangeAccount', 'NewExchangeOrder',
                'SignUp', 'Login', 'Set Currency'
            ].indexOf(navState.routeName) > -1

            const noSearchButton = [
                'Restore Wallet', 'New Wallet', 'Confirm Phrase', 'SignUp', 'Login'
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
                    content={
                        <Menu
                            navigation={navigation}
                            items={Items}
                            showStatusBar={true}
                            baseAccent={baseAccent}
                            brandColor={brandColor}
                            baseColor={baseColor}
                            hideBorder={true}
                        />
                    }
                    tapToClose
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: baseColor,
                            paddingTop: hideHeader ? 40 : 0
                        }}
                    >
                        {!hideHeader && <NBHeader
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
                                    {headerBody}
                                </Body>
                                <Right>
                                {(false && isTokenDetails) ?
                                    <TouchableWithoutFeedback
                                        style={{ justifyContent: "center", alignItems: "center", width: 60 }}
                                        onPress={()=>{shareTokenDetails(tokenDetails.symbol)}}
                                    >
                                        <Ionicons name="ios-share" size={28} color="white" />
                                    </TouchableWithoutFeedback>
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
                        }
                        <Spinner
                            visible={this.props.isLoading}
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