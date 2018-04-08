import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, WebView } from 'react-native';
import QRButton from '../Common/QRButton'
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseAccent, baseColor, brandColor, lossColor } from '../../config'
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { addExchangeAccount } from '../../helpers/api';
import { withDrawer } from '../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
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

class NewExchangeAccount extends Component {

    static getHeader = (navState) => {
        const { name, image } = navState.params
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={customStyles.image} source={{uri: image}}></Image>
                <Text style={{color: '#fff'}}>{ name }</Text>
            </View>
        )
    }

    state = {
        key: null,
        secret: null,
        name: null,
        passphrase: null,
        showScanner: false
    }

    submit = () => {
        const { navigation, accountId } = this.props
        const { platformId: exchangeId } = navigation.state.params
        const { key, secret, name, passphrase } = this.state

        console.log({ id: accountId, key, secret, name, passphrase, exchangeId })
        addExchangeAccount({ id: accountId, key, secret, name, passphrase, exchangeId })
    }

    render() {
        const { navigation } = this.props
        const { platform } = navigation.state.params

        return (
            <StyleProvider style={getTheme(_platform)}>
                <Container>
                    <Content>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Add Your {platform} Keys</Text>
                            
                            <Text style={styles.subHeading}>
                                Provide your exchange account keys that do not have withdraw access. These keys will be sent to our servers so that we can automatically track your exchange balances and initiate trades. 
                            </Text>
                        </View>
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>API Key</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter or Scan API Key"
                                 onChangeText={key=>this.setState({ key })}
                             />
                            <QRButton
                                style={{paddingTop: 10, alignSelf: 'flex-end'}}
                                onScan={key=>this.setState({ key })}
                            />
                        </View>

                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Secret Key</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Secret Key"
                                 onChangeText={(secret)=>{this.setState({ secret })}}
                             />
                        </View>
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Passphrase</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Passphrase"
                                 onChangeText={(passphrase)=>{this.setState({ passphrase })}}
                             />
                        </View>

                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Custom Name</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="Enter Custom Name"
                                 onChangeText={(name)=>{this.setState({ name })}}
                             />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"Add Account"}
                                block
                                onPress={() => { this.submit() }}>
                                <Text style={{color: '#000'}}>Add Account</Text>
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
    accountId: state.account.id,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(NewExchangeAccount));