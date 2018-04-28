import React, { Component } from 'react';
import {
    Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, AsyncStorage, Alert, TouchableHighlight, Platform } from 'react-native';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import {  enableTwoFactorAuth, verifyTwoFactorAuthToken } from '../../../reducers/security';
import { showToast } from '../../../reducers/ui';
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';
import styles from '../styles'

class VerifyPin extends Component {
    state = {
        pin: '',
        invalid: false,
        pinLength: 6
    }

    submit = () => {
        const { navigation } = this.props
        const { pin } = this.state
        const { callback } = navigation.state.params
        if (pin) {
            console.log('submit', pin)
            callback(pin, this.onValidate)
        } else {
            Alert.alert('Code must not be empty')
        }
    }

    onValidate = (result) => {
        this.setState({
            invalid: !result
        })
    }

    render () {
        const { pin, invalid, pinLength } = this.state
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content style={{paddingHorizontal: 10}}>
                        <Text style={styles.heading}>Verify Pin</Text>
                        <Text style={styles.subHeading}>Please enter Pin</Text>
                        <Item style={{marginTop: 10}}>
                            <Label style={styles.subHeading}>Pin:</Label>
                            <Input
                                style={styles.subHeading}
                                bordered
                                value={pin}
                                maxLength={pinLength}
                                onChangeText={(code)=>this.setState({ pin })}
                            />
                            <Button
                                primary
                                onPress={this.submit}
                            ><Text>Submit</Text></Button>
                        </Item>
                        {invalid && <Text style={{color: '#fff'}}>Invalid pin, please try again.</Text>}
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(VerifyPin));