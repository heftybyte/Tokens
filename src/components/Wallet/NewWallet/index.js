import React, { Component } from 'react';
import { Alert, Clipboard, WebView } from 'react-native';
import QRScanner from './../../Common/QRScanner';
import { NavigationActions } from 'react-navigation';
import { baseAccent, baseColor, brandColor, lossColor } from '../../../config'
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { generateAddressFromMnemonic, storeWallet } from '../../../helpers/wallet';
import { withDrawer } from '../../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';
import styles from '../styles'

const customStyles = {
    warningText: {
        color: '#ff0000',
        fontSize: 14,
        paddingHorizontal: 20,
        paddingBottom: 20,
        fontWeight: 'bold'
    }
}

class NewWallet extends Component {
    state = {
        "mnemonic": false,
        copied: false
    }

    onWebViewMessage = (event) => {
        this.setState({
            "mnemonic": event.nativeEvent.data
        })
    }

    render() {
        const {
            goToConfirmPhrasePage
        } = this.props
        const { copied, mnemonic } = this.state
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                        <WebView
                            ref={webview => { this.webView = webview; }}
                            source={require("../../../resources/index.html")}
                            javaScriptEnabled={true}
                            style={{}}
                            onMessage={(event) => {this.onWebViewMessage(event)} }
                        />

                        <View style={styles.header}>
                            <Text style={styles.heading}>Backup Phrase</Text>
                            
                            <Text style={styles.subHeading}>
                                This phrase is your wallet’s password. It will be encrypted and stored on your physical device to be used for transactions. This shouldn’t be shared with anyone. It never gets sent to our servers so we won’t be able to recover it for you. Write it down and keep it safe. If its lost, you will lose access to all funds in the wallet.
                            </Text>
                        </View>

                        <View style={[styles.mnemonicContainer, { marginBottom: 20 }]}>
                        {
                            (mnemonic) ?
                                <Text
                                    style={styles.mnemonic}
                                    selectable
                                    onPress={()=>this.setState({ copied: true })}
                                >{this.state.mnemonic}</Text>
                            :
                            <Text
                                style={styles.mnemonic}
                            >generating backup phrase...</Text>
                        }
                        </View>
                        {copied && <Text style={customStyles.warningText}>
                            Don't just copy this phrase, write it down. It is the password for your wallet and the only way to recover your funds if your phone is lost or reset. We do not keep a copy on our servers and will not be able to recover it for you.
                        </Text>}
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"continue"}
                                block
                                onPress={()=>goToConfirmPhrasePage(mnemonic)}>
                                <Text style={{color: '#000'}}>Continue</Text>
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
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        goToConfirmPhrasePage: (mnemonic) => dispatch(NavigationActions.navigate({ routeName: 'Confirm Phrase', params: { mnemonic }}))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(NewWallet));