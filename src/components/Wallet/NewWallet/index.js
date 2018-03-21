/**
 * Created by Samparsky on 19/03/2018.
 */
import React, { Component } from 'react';
import { WebView, StyleSheet, Alert } from 'react-native';
import QRScanner from './../../Common/QRScanner';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form} from 'native-base';
// import { GenerateMnemonic } from '../../../helpers/wallet'
import { withDrawer } from '../../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    input: {
        color: '#fff',
    }
});

class NewWallet extends Component {
    state = {
        "mnemonic": "",
        "new_text": "hello"
    }

    createWallet = async() => {
        const mnemonic = await GenerateMnemonic()
        SecureStore.setItemAysnc(constants.wallet.mnemonic, mnemonic)
    }

    handleDataReceived = (data) => {

    }

    onWebViewMessage = (event) => {
        console.log("Message received from webview");
        console.log(event)
        Alert.alert(event.nativeEvent.data)
        this.setState({
            "new_text": "world"
        })
    }


    render() {
        return (
            <Container>
                <Content>
                <Text style={{color: "#fefefe"}}>{this.state.new_text}</Text>
                <View style={{backgroundColor: "#fefefe", flex: 4}}>
                    <WebView
                            ref={webview => {
                                        this.WebView = webview;
                                    }}
                            source={require("./../../../resources/index.html")}
                            onShouldStartLoadWithRequest={() => true}
                            javaScriptEnabledAndroid={true}
                            startInLoadingState={true}
                            style={{ flex: 1, height: 200, width: 400 }}
                            onMessage={this.onWebViewMessage}
                    />
                    </View>
                    <ListItem>
                        <Form>
                            <Item stackedLabel>
                                <Label>Username</Label>
                                <Input
                                    style={styles.input}
                                    placeholder={'Title'}
                                    placeholderTextColor='#444'
                                />
                            </Item>
                            <Text>Your Phrase</Text>
                            <Text>Please kindly write down the phrase you would be required
                        to re enter it in the next stage.</Text>
                            <Input
                                style={styles.input}
                                multiline
                                numberOfLines={4}
                            />
                        </Form>
                    </ListItem>
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
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(NewWallet));