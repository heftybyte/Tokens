import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { Fingerprint } from 'expo'
import { getPin, deletePin } from '../../../helpers/security'
import { enableFingerprint, enablePin, disablePin, disableFingerprint } from '../../../actions/security';
import { enableTwoFactorAuth } from '../../../reducers/security';
import { brandColor } from '../../../config'

const styles = StyleSheet.create({  
    white: {
        color :'#fff',
    },
    grey: {
        color: '#4c4c4c'
    },
    title: {
        color: brandColor,
        fontSize: 18
    }
})

class TwoFactorAuth extends Component {

    disableTwoFactor = async() => {
        const {
            disableFingerprint,
            disablePin,
            enableTwoFactorAuth
        } = this.props

        Alert.alert(
            'Disable Two Factor Authentication',
            'Will you like to disable pin?',
            [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {
                    disablePin();
                    Alert.alert('Pin Disabled');
                    deletePin();
                }},
            ],
            { cancelable: true }
        )
    }

    enableTwoFactor = async() => {
        const {
            enableTwoFactorAuth,
        } = this.props

        Alert.alert(
            'Enable Two Factor',
            'Will you like to enable pin?',
            [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {
                    enableTwoFactorAuth();
                }},
            ],
            { cancelable: true }
        )
    }

    twoFactorAuth = async () => {
        const {
            hasTwoFactorAuthEnabled
        } = this.props

        if(hasTwoFactorAuthEnabled){
            await this.disableTwoFactor()
        }
        await this.enableTwoFactor()
    }

    render () {
        const {
            goToSetPinPage,
            hasTwoFactorAuthEnabled
        } = this.props

        return(
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.title}>Overview</Text>
                        </ListItem>
                        <ListItem onPress={this.twoFactorAuth} noBorder>
                            <Body>
                                <Text style={styles.white}>Enable two-factor authentication</Text>
                                <Text style={styles.grey}>
                                    Two-factor authentication adds a layer of security to your account.
                                    When signing in, you'll need to enter your password and a verification code we send
                                    to your mobile device. 
                                </Text>
                                <Text style={styles.grey}>Please ensure you have Google authenticator app installed from Appstore or Playstore. </Text>
                            </Body>
                            <Right style={{paddingRight: 10}}>
                                <CheckBox
                                    checked={hasTwoFactorAuthEnabled}
                                />
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    portfolio: state.account.portfolio,
    wallets: state.account.wallets,
    hasTwoFactorAuthEnabled: state.security.hasTwoFactorAuthEnabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        enableTwoFactorAuth: () => dispatch(enableTwoFactorAuth()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TwoFactorAuth));