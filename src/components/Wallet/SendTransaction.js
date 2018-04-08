import React, { Component } from 'react';
import { WebView, Alert, TouchableHighlight } from 'react-native';
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
        fontSize: 12,
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
    }
}

class SendTransaction extends Component {

    static getHeaderText = (navState) => `Send ${navState.params.currencyName}`

    state = {
        showAdvanced: false,
        showScanner: false,
        recipient: null,
        quantity: 0,
        gas: 21000,
        data: null
    }

    onScanAddress = (address) => {
        this.setState({
            recipient: address
        })
    }

    onSaveScan = (address) => {
        console.log({address})
        this.setState({
            showScanner: false
        })
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
        const { data, gas, quantity, recipient, showAdvanced, showScanner } = this.state
        const { id, currencyName, currencySymbol } = navigation.state.params
        console.log('re', recipient)
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>    
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading]}>Sending {currencyName} From</Text>
                            <Text style={customStyles.input}>{id}</Text>
                        </View>

                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Sending {currencyName} To</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Recipient Address"
                                 value={recipient}
                                 onChangeText={(address)=>{this.setState({recipient: address})}}
                             />
                            <QRButton
                                style={{paddingTop: 10, alignSelf: 'flex-end'}}
                                onChangeText={this.onScanAddress}
                                saveAddress={this.onSaveScan}
                            />
                        </View>
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Quantity ({currencySymbol})</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Quantity"
                                 value={quantity}
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
                                <Text style={{color: '#000'}}>Send</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SendTransaction));