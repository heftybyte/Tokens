import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform, TextInput } from 'react-native';
import { Container, Label, Input,Form, Content, ListItem, Text, Radio, Footer, Button, Item} from 'native-base';
import { getPin, storePin } from '../../../helpers/security'
import { enablePin } from '../../../actions/security';

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
})

class SetPin extends Component {

    state = {
        "newPin": null,
        "oldPin": null,
        "confirmPin": null,
        'pinExists': false,
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

    onInputChange (event){
        Alert.alert('change')
        console.log('event')
        console.log(event)
        this.setState({
            [event.name]: event.value
        })
    }

    changePin = async function() {
        Alert.alert('in set pin')

        const storedPin = await getPin()
        if(storedPin == this.state.oldPin){
            await this.setPin()
        }
        Alert.alert('wrong previous pin')
    }

    setPin = async function() {
        Alert.alert('in set pin')
        console.log('newPin')
        console.log(this.state.newPin)
        console.log(this.state.confirmPin)

        if(this.state.newPin.length != 4 || this.state.confirmPin.length!=4){
            // error
            Alert.alert('please check pin')
            return
        }

        if(this.state.newPin != this.state.confirmPin){
            // error
            Alert.alert('Pins don\'t match')
            return
        }

        const result = await storePin(this.state.newPin)
        console.log(result)

        Alert.alert('pin set successfully')
        this.props.goToSecuritySettingsPage()
    }

    render () {
        return(
            <Container>
                <Content>
                    <Text style={styles.white}>Enter your 4 digit pin</Text>
                    <Form>
                        {
                            (this.state.pinExists) ?
                                <Item floatingLabel>
                                    <Label>Old Pin</Label>
                                    <TextInput
                                        contextMenuHidden
                                        secureTextEntry
                                        style={styles.input}
                                        onEndEditing={this.handleChange.bind(this)}
                                        placeholderTextColor={'#333'}
                                        autoCapitalize={'characters'}
                                    />
                                    {/*<Input*/}
                                        {/*style={styles.white}*/}
                                        {/*name="oldPin"*/}
                                        {/*maxLength={4}*/}
                                        {/*keyboardType = 'numeric'*/}
                                        {/*contextMenuHidden*/}
                                        {/*secureTextEntry*/}
                                        {/*onChange={this.handleChange}*/}
                                    {/*/>*/}
                                </Item>
                                : <View />
                        }

                        <Item floatingLabel>
                            <Label>New Pin</Label>
                            <TextInput
                                name="newPin"
                                style={styles.input}
                                value={this.state.newPin}
                                onChangeText={(text)=>{this.setState({newPin: text})}}
                                contextMenuHidden
                                secureTextEntry
                            />
                            {/*<Input*/}
                                {/*style={styles.white}*/}
                                {/*name="newPin"*/}
                                {/*maxLength={4}*/}
                                {/*keyboardType = 'numeric'*/}
                                {/*contextMenuHidden*/}
                                {/*secureTextEntry*/}
                                {/*onChange={this.handleChange}*/}
                            {/*/>*/}
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirm Pin</Label>
                            <TextInput
                                name="confirmPin"
                                contextMenuHidden
                                secureTextEntry
                                style={styles.input}
                                onChangeText={(text)=>{this.setState({confirmPin: text})}}
                                value={this.state.confirmPin}
                                autoCapitalize={'characters'}
                            />
                            {/*<Input*/}
                                {/*style={styles.white}*/}
                                {/*name="confirmPin"*/}
                                {/*maxLength={4}*/}
                                {/*keyboardType = 'numeric'*/}
                                {/*contextMenuHidden*/}
                                {/*secureTextEntry*/}
                                {/*onChange={this.handleChange}*/}
                            {/*/>*/}
                        </Item>
                    </Form>
                    {
                        this.state.pinExists ?
                            <Button full success onPress={this.changePin.bind(this)}>
                                <Text>Change Pin</Text>
                            </Button>
                            :
                            <Button full success onPress={this.setPin.bind(this)}>
                                <Text>Set Pin</Text>
                            </Button>
                    }
                </Content>
            </Container>
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