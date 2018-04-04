import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform } from 'react-native';
import { Container, Label, Input,Form, Content, ListItem, Text, Radio, Footer, Button, Item} from 'native-base';
import { getPin, storePin } from '../../../helpers/security'
import { enablePin } from '../../../actions/security';

const styles = StyleSheet.create({
    white: {
        color :'#fff',
    },
})

class SetPin extends Component {

    state = {
        "newPin": null,
        "oldPin": null,
        "confirmPin": null,
        'hasPinEnabled': false,
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }


    async componentDidMount() {

    }

    async handleChange(event){
        this.setState({
            [event.name]: event.value
        })
    }

    async changePin() {
        if(this.state.oldPin.length!=4){
            // error
        }
        const storedPin = await getPin()
        if(storedPin == this.state.oldPin){
            await this.setPin()
        }
        Alert.alert('wrong previous pin')
    }

    async setPin() {
        if(this.state.newPin.length != 4 || this.state.confirmPin.length!=4){
            // error
            Alert.alert('pin set successfully')

        }

        if(this.state.newPin != this.state.confirmPin){
            // error
            Alert.alert('Pins don\'t match')

        }

        const result = await storePin(this.state.newPin)
        console.log(result)

        if(!result){

        }
        Alert.alert('pin set successfully')
    }

    render () {
        const {
            hasPinEnabled
        } = this.props

        return(
            <Container>
                <Content>
                    <Text style={styles.white}>Enter your 4 digit pin</Text>
                    <Form>
                        {
                            (hasPinEnabled) ?
                                <Item floatingLabel>
                                    <Label>Old Pin</Label>
                                    <Input
                                        style={styles.white}
                                        name="oldpin"
                                        maxLength={4}
                                        keyboardType = 'numeric'
                                        contextMenuHidden
                                        secureTextEntry
                                        onChange={this.handleChange}
                                    />
                                </Item>
                                : <View />
                        }

                        <Item floatingLabel>
                            <Label>New Pin</Label>
                            <Input
                                style={styles.white}
                                name="newpin"
                                maxLength={4}
                                keyboardType = 'numeric'
                                contextMenuHidden
                                secureTextEntry
                                onChange={this.handleChange}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirm Pin</Label>
                            <Input
                                style={styles.white}
                                name="confirmpin"
                                maxLength={4}
                                keyboardType = 'numeric'
                                contextMenuHidden
                                secureTextEntry
                                onChange={this.handleChange}
                            />
                        </Item>
                        <Button full success>
                            <Text>Success</Text>
                        </Button>
                    </Form>
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
        enablePin: () => dispatch(enablePin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SetPin));