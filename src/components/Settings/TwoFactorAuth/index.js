import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { disablePin, disableFingerprint } from '../../../actions/security';
import { setTwoFactorAuthSecret, disableTwoFactorAuth } from '../../../reducers/security';

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

    static headerText = 'Two Factor Auth'

    disableTwoFactor = async() => {
        const {
            disableTwoFactorAuth
        } = this.props

        Alert.alert(
            'Disable 2FA',
            'Will you like to disable Two-Factor Auth?',
            [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {
                    disableTwoFactorAuth();
                }},
            ],
            { cancelable: true }
        )
    }

    enableTwoFactor = async() => {
        const {
            setTwoFactorAuthSecret,
        } = this.props

        Alert.alert(
            'Enable 2FA',
            'Will you like to enable Two-Factor Auth?',
            [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {
                    setTwoFactorAuthSecret();
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
            return
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
                        <ListItem onPress={this.twoFactorAuth} noBorder style={{width: '100%'}}>
                            <Body>
                                <Text style={styles.white}>{`${ hasTwoFactorAuthEnabled ? 'Disable' : 'Enable'}\n`}</Text>
                                <Text style={styles.grey}>
                                    { !hasTwoFactorAuthEnabled ? 
                                        `When signing in, you'll need to enter a verification code from Google Authenticator.`
                                        :
                                        `This additional layer of security will be removed from your account.`
                                    }
                                </Text>
                            </Body>
                            <Right style={{paddingRight: 20}}>
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
    hasTwoFactorAuthEnabled: state.account.two_factor_enabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        setTwoFactorAuthSecret: () => dispatch(setTwoFactorAuthSecret()),
        disableTwoFactorAuth: () => dispatch(disableTwoFactorAuth())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(TwoFactorAuth));