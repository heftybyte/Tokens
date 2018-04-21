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
import { getErrorMsg, } from '../../helpers/functions';
import { logger } from '../../helpers/api';
import { SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';
import styles from './styles'
import { setLoading, showToast } from '../../reducers/ui'

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
    addressInput: {
        fontSize: 12,
        fontFamily: 'Nunito'
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

class SendTransaction extends Component {

    static getHeader = (navState) => {
        const { currencyName, image } = navState.params
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={customStyles.image} source={{uri: image}}></Image>
                <Text style={{color: '#fff'}}>{ currencyName }</Text>
            </View>
        )
    }

    state = {
        showAdvanced: false,
        showScanner: false,
        recipient: null,
        amount: 0,
        gas: 21000,
        data: null
    }

    send = async () => {
        const { navigation, setLoading, showToast } = this.props
        const { id, contractAddress } = navigation.state.params
        const { data, gas, recipient, amount } = this.state
        setLoading(true, 'Sending Transaction')
        try {
            if (recipient === id) {
                throw new Error('Recipient must be different')
            }
            const transaction = await send({publicKey: id, recipient, amount, contractAddress, gas})
            setLoading(false)
            this.setState({
                transactionHash: transaction.hash
            })
            showToast('Transaction Sent')
        } catch(err) {
            setLoading(false)
            logger.error('wallet send', err)
            showToast(getErrorMsg(err))
        }
    }

    render() {
        const { navigation } = this.props
        const { data, gas, amount, recipient, showAdvanced, showScanner, transactionHash } = this.state
        const { id, currencyName, currencySymbol } = navigation.state.params
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>    
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading]}>Sending {currencySymbol} From</Text>
                            <Text selectable style={[customStyles.input, customStyles.addressInput]}>{id}</Text>
                        </View>

                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Sending {currencySymbol} To</Text>
                            <Input
                                 style={[customStyles.input, customStyles.addressInput]}
                                 placeholder="Enter or Scan Recipient Address"
                                 value={recipient}
                                 onChangeText={recipient=>this.setState({ recipient })}
                             />
                            <QRButton
                                style={{alignSelf: 'flex-end'}}
                                onScan={recipient=>this.setState({ recipient })}
                            />
                        </View>
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0}]}>Quantity ({currencySymbol})</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Quantity"
                                 value={amount}
                                 onChangeText={(amount)=>{this.setState({ amount })}}
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
                        {!!transactionHash && <Text selectable style={{color:'#fff', padding: 20, textAlign: 'center'}}>Transaction sent {transactionHash}</Text>}
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
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        setLoading: (isLoading, msg) => dispatch(setLoading(isLoading, msg)),
        showToast: (msg) => dispatch(showToast(msg))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SendTransaction));