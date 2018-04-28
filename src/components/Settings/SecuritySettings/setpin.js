import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform, TextInput } from 'react-native';
import { Container, Label, Input,Form, Content, ListItem, Text, Radio, Footer, Button, Item, StyleProvider } from 'native-base';
import { getPin, storePin } from '../../../helpers/security'
import { enablePin } from '../../../actions/security';
import { brandColor } from '../../../config'
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';

const styles = StyleSheet.create({
    white: {
        color :'#fff',
    },
    grey: {
        color: '#4c4c4c'
    },
    input: {
        color: '#fff',
        backgroundColor: '#111',
        height: 50,
        padding: 10,
        textAlign: 'center',
        fontSize: 20
    },
    title: {
        color: brandColor,
        fontSize: 18,
        marginBottom: 20
    }
})

class SetPin extends Component {

    state = {
        "newPin": null,
        "oldPin": null,
        "confirmPin": null,
        'pinExists': false,
        pinLength: 6
    }

    async componentDidMount() {
        const pin = await getPin()
        console.log('pin')
        console.log(pin)

        if(pin){
            this.setState({
                'pinExists': true,
            })
        }
    }

    handleChange (event){
        this.setState({
            [event.name]: event.value
        })
    }

    changePin = async function() {
        const storedPin = await getPin()
        if(storedPin === this.state.oldPin){
            await this.setPin()
            return
        }
        Alert.alert('Invalid Previous Pin')
    }

    setPin = async function() {
        const { newPin, confirmPin, pinLength } = this.state
        if(newPin.length != pinLength || confirmPin.length != pinLength){
            // error
            Alert.alert('Invalid Pin')
            return
        }

        if(this.state.newPin != this.state.confirmPin){
            // error
            Alert.alert('Pins don\'t match')
            return
        }

        const result = await storePin(this.state.newPin)

        Alert.alert('Pin Set Successfully')
        this.props.goToSecuritySettingsPage()
    }

    render () {
        const { pinLength } = this.state
        return(
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content style={{paddingHorizontal:20}}>
                        <Text style={styles.title}>Enter a {pinLength} Digit Pin Code</Text>
                        <Form>
                            {
                                (this.state.pinExists) ?
                                    <View>
                                        <Label style={styles.white}>Old Pin</Label>
                                        <TextInput
                                            contextMenuHidden
                                            secureTextEntry
                                            style={styles.input}
                                            onChangeText={(text) => { this.setState({oldPin: text}); }}
                                            placeholderTextColor={'#333'}
                                            placeholder={'Enter Old Pin'}
                                            autoCapitalize={'characters'}
                                            maxLength={this.state.pinLength}
                                        />
                                    </View>
                                    : <View />
                            }

                                <Label style={styles.white}>New Pin</Label>
                                <TextInput
                                    name="newPin"
                                    style={styles.input}
                                    value={this.state.newPin}
                                    onChangeText={(text)=>{ this.setState({newPin: text}); }}
                                    contextMenuHidden
                                    placeholderTextColor={'#333'}
                                    placeholder={'Enter New Pin'}
                                    secureTextEntry
                                    maxLength={this.state.pinLength}
                                />
                                <Label style={styles.white}>Confirm Pin</Label>
                                <TextInput
                                    contextMenuHidden
                                    secureTextEntry
                                    placeholder={'Confirm Pin'}
                                    placeholderTextColor={'#333'}
                                    style={styles.input}
                                    onChangeText={(text)=>{  this.setState({confirmPin: text}); }}
                                    value={this.state.confirmPin}
                                    maxLength={this.state.pinLength}
                                />
                        </Form>
                        {
                            this.state.pinExists ?
                                <Button full primary onPress={this.changePin.bind(this)}>
                                    <Text style={{color: '#000'}}>Change Pin</Text>
                                </Button>
                                :
                                <Button full primary onPress={this.setPin.bind(this)}>
                                    <Text style={{color: '#000'}}>Set Pin</Text>
                                </Button>
                        }
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

const mapStateToProps = (state) => ({
    portfolio: state.account.portfolio,
    wallets: state.account.wallets,
    hasPinEnabled: state.security.hasPinEnabled,
    hasFingerprintEnabled: state.security.hasFingerprintEnabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        enablePin: () => dispatch(enablePin()),
        goToSecuritySettingsPage: () =>  dispatch(NavigationActions.back()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SetPin));