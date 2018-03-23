import React, { Component } from 'react';
import { WebView, StyleSheet, Alert } from 'react-native';
import QRScanner from './../../Common/QRScanner';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form } from 'native-base';
import { GenerateAddressFromMnemonic, StoreWallet } from '../../../helpers/wallet';
import { withDrawer } from '../../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    input: {
        color: '#fff',
    },
    mnemonic: {
        color: "#f3f3f3",
        fontSize: 24,
    },
    title: {
        fontSize: 36,
        color: "#f3f3f3"
    }
});

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
            <Container>
                <Content>
                <View style={{backgroundColor: "#fefefe", flex: 4}}>
                    <WebView
                            ref={webview => { this.webView = webview; }}
                            source={require("./../../../resources/index.html")}
                            javaScriptEnabled={true}
                            style={{}}
                            onMessage={(event) => {this.onWebViewMessage(event)} }
                    />
                    </View>
                    <Text style={styles.title}>Seed Phrase</Text>
                    
                    <Text style={styles.input}>Confirm your 12-word backup phrase. Keep a written copy
                    saved and secured. This is a key that is private to you and shouldn't be shared with anyone</Text>

                    <View style={{marginTop: 20,marginBottom: 100}}>
                    {
                        (mnemonic) ?
                            <Text
                                style={styles.mnemonic}
                            >{this.state.mnemonic}</Text>
                        :
                        <Text
                            style={styles.mnemonic}
                        >loading...</Text>
                    }
                    </View>

                <Button title={"continue"} block primary onPress={() => { goToConfirmPhrasePage(mnemonic) }}>
                    <Text>Continue</Text>
                </Button>
                </Content>
            </Container>
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
        goToConfirmPhrasePage: (mnemonic) => dispatch(NavigationActions.navigate({ routeName: 'Confirm Phrase', mnemonic})),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(NewWallet));