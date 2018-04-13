import React, { Component } from 'react';
import { WebView, Alert } from 'react-native';
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

class NewWallet extends Component {

    state = {
        "mnemonic": false,
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
        const { mnemonic } = this.state
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                            <WebView
                                ref={webview => { this.webView = webview; }}
                                source={require("./../../../resources/index.html")}
                                javaScriptEnabled={true}
                                style={{}}
                                onMessage={(event) => {this.onWebViewMessage(event)} }
                            />
                        
                        <View style={styles.header}>
                            <Text style={styles.heading}>Confirm Backup Phrase</Text>
                            
                            <Text style={styles.subHeading}>
                                This phrase gives access to your wallet funds and as such should not be shared with anyone. It will be encrypted and stored on your physical device. This never gets sent to our servers. We will not be able to recover it for you if you lose it.
                            </Text>
                        </View>

                        <View style={styles.mnemonicContainer}>
                        {
                            (mnemonic) ?
                                <Text
                                    style={styles.mnemonic}
                                    selectable
                                >{this.state.mnemonic}</Text>
                            :
                            <Text
                                style={styles.mnemonic}
                            >generating backup phrase...</Text>
                        }
                        </View>
                        {/*<Text style={styles.warningText}>
                            Write this phrase down now. You will never be able to recover your funds without it.
                        </Text>*/}
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"continue"}
                                block
                                onPress={() => { goToConfirmPhrasePage(mnemonic) }}>
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