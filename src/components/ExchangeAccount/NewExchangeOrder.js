import React, { Component } from 'react';
import { Image, WebView, Alert, TouchableHighlight } from 'react-native';
import QRButton from '../Common/QRButton'
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseAccent, baseColor, brandColor, lossColor } from '../../config'
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { send } from '../../helpers/wallet';
import { withDrawer } from '../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';
import styles from './styles'

const customStyles = {
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    heading: {
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 10,
        borderTopWidth: 0,
        borderWidth: 0
    },
    input: {
        color: '#fff',
        fontSize: 16,
        borderColor: baseAccent,
        borderBottomWidth: 1,
        paddingLeft: 10
    },
    qrContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderColor: brandColor,
        borderWidth: 1,
        paddingVertical: 10,
        marginTop: 10
    },
    qrButton: {
        flex: .3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrButtonText: {
        color: brandColor,
    },
    showAdvanced: {
        color: brandColor,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20
    },
    image: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 5
    }
}

const OrderTypes = {
    'MARKET': 'market',
    'LIMIT': 'limit',
    'STOP_LOSS': 'stop_loss',
    'STOP_LIMIT': 'stop_limit'
}

const ActionText = {
    'buy': 'Buying',
    'sell': 'Selling'
}

class NewExchangeOrder extends Component {

    static getHeader = (navState) => {
        const { currencyName, image } = navState.params
        console.log({ currencyName, image })
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={customStyles.image} source={{uri: image}}></Image>
                <Text style={{color: '#fff'}}>{ currencyName }</Text>
            </View>
        )
    }

    state = {
        showAdvanced: false,
        quantity: 0,
        orderType: OrderTypes.MARKET,
        limit: null,
        stop: null
    }

    send = () => {
        const { navigation } = this.props
        const { id, contractAddress } = navigation.state.params
        const { data, gas, recipient, quantity } = this.state

        console.log({ data, gas, recipient, quantity, contractAddress })
        send({id, recipient, quantity, contractAddress, gas})
    }

    render() {
        const { navigation } = this.props
        const { limit, stop, quantity, orderType, showAdvanced } = this.state
        const {
            name,
            id,
            currencyName,
            currencySymbol,
            action,
            exchangeName,
            exchangeImage,
            price
        } = navigation.state.params
        const actionText = ActionText[action]
        console.log({exchangeImage})
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>    
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading]}>{actionText} {currencySymbol} From</Text>
                            <View style={{flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center'}}>
                                <Image source={{ uri: exchangeImage}} style={customStyles.image} />
                                <Text style={customStyles.input}>{ exchangeName }</Text>
                                <Text style={customStyles.input, { paddingLeft: 5, fontSize: 14, color: '#999'}}>{name || id}</Text>
                            </View>
                        </View>

                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Market Price</Text>
                            <Input
                                 style={customStyles.input}
                                 value={`$${price}`}
                                 onChangeText={(quantity)=>{this.setState({ quantity })}}
                             />
                        </View>
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Quantity ({currencySymbol})</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Quantity"
                                 value={quantity.toString()}
                                 onChangeText={(quantity)=>{this.setState({ quantity })}}
                             />
                        </View>
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Estimated Total</Text>
                            <Input
                                 style={customStyles.input}
                                 value={`$${quantity*price}`}
                                 onChangeText={(quantity)=>{this.setState({ quantity })}}
                             />
                        </View>
                        <TouchableHighlight onPress={()=>this.setState({ showAdvanced: !showAdvanced })}>
                            <Text style={customStyles.showAdvanced}>{showAdvanced ? 'Hide' : 'Show'} Advanced</Text>
                        </TouchableHighlight>
                       {showAdvanced &&
                        <View style={[customStyles.header, {flex: 1}]}>
                           <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Gas</Text>
                           <Input
                                style={customStyles.input}
                                value={gas.toString()}
                                onChangeText={(gas)=>{this.setState({ gas })}}
                            />
                        </View>}

                        {showAdvanced &&
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Data</Text>
                            <Input
                                 style={customStyles.input}
                                 value={data}
                                 placeholder={'Enter Transaction Data'}
                                 onChangeText={(data)=>{this.setState({ data })}}
                             />
                        </View>}
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"continue"}
                                block
                                onPress={() => { this.send() }}>
                                <Text style={{color: '#000'}}>Submit Order</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

const mapStateToProps = (state) => ({
    portfolio: state.account.portfolio,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(NewExchangeOrder));