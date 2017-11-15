import React, { PureComponent } from "react"
import { View, TouchableOpacity, Text, Platform, Alert, Image } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Drawer from "react-native-drawer"
import { observer } from "mobx-react/native"
import { Button, Header as NBHeader, Left, Body, Right, Content } from "native-base"
import { Constants } from 'expo'
import Spinner from 'react-native-loading-spinner-overlay';
import { trackTap } from '../helpers/analytics'
import Header from "../components/Dashboard/Header"
import Toast, { DURATION } from 'react-native-easy-toast'
import store from '../store'
import { NavigationActions } from "react-navigation";
import { baseURL } from '../config'

const Items = [
    {
        name: "Dashboard",
        icon: "apps",
        route: "Dashboard"
    },
    {
        name: "Account",
        icon: "account-circle",
        route: "Accounts"
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
            const isTokenDetails = navState.routeName === 'Token Details'
            const { token } = navState && navState.params || {}
            // Remove after: https://app.asana.com/0/425477633452716/477358357686745
            const showBackButton = ['Token Details', 'Search', 'Add Address'].indexOf(navState.routeName) > -1

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
                            backgroundColor: '#000'
                        }}
                    >
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
                                style={{ 
                                    justifyContent: "center",
                                    alignItems: Platform.OS === 'ios' ? "center" : "flex-start",
                                    width: 60,
                                }}
                                transparent
                                onPress={ showBackButton ?
                                    ()=>{trackTap('Menu Back'); store.dispatch(NavigationActions.back())} :
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
                                {isTokenDetails ?
                                    <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center', flex:1}}>
                                        <Image key={token.symbol} source={{ uri: baseURL + token.imageUrl }} style={{width: 20, height: 20}}/>
                                        <Text style={{color: '#fff', paddingLeft: 10}}>
                                            {token.symbol}
                                        </Text> 
                                    </View> :
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 16,
                                            fontFamily: 'Nunito-ExtraLight',
                                        }}
                                    >
                                        {headerText}
                                    </Text>
                                }
                            </Body>
                            <Right>
                                <Button
                                    style={{ justifyContent: "center", alignItems: "center", width: 60 }}
                                    transparent
                                    onPress={()=>{trackTap('Search');navigation.dispatch({type: 'Search'})}}
                                >
                                    <Ionicons name="ios-search-outline" size={28} color="white" />
                                </Button>
                            </Right>
                        </NBHeader>
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