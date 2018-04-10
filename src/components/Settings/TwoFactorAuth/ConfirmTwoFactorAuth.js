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
import { brandColor } from '../../../config'
import { setLoading, showToast } from '../../../reducers/ui';
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';
import styles from '../styles'

const ShowSecretKey = ({showToast, secretKey, copyToClipboard, confirmedTwoFactor}=props) => (
    <View style={{flex: 1}}>
        <Text style={styles.heading}>Manual Entry</Text>
        <Text style={styles.subHeading}>Please kindly enter the secret key and label below into the google authenticator app via manual
        entry.</Text>
        <Text style={styles.subHeading}>Account</Text>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>

            <Text style={styles.subHeading}>Tokens Express</Text>
            <Button primary onPress={()=>{copyToClipboard('Tokens Express','Account copied to your Clipboard')}}><Text>Copy</Text></Button>
        </View>
        <Text style={styles.subHeading}>Secret Key</Text>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.subHeading}>{secretKey}</Text>
            <Button
                primary
                onPress={()=>{copyToClipboard(secretKey, 'Secret Key copied to your Clipboard')}}
                ><Text>Copy</Text></Button>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button
                primary
                block
                onPress={()=>{confirmedTwoFactor()}}>
                <Text>Continue</Text>
            </Button>
        </View>
    </View>
)

const ShowVerifyAuthToken = ({verifyAuthToken, setToken}=props) => (
    <View style={{flex: 1}}>
        <Text style={styles.heading}>Verify Two Factor Auth</Text>
        <Form>
            <Item>
                <Input
                    style={styles.mnemonic}
                    placeholder="Enter Two Factor Token"
                    multiline
                    onChangeText={(text)=>{setToken(text)}}
                    bordered
                />
            </Item>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Button
                    primary
                    block
                    onPress={()=>{verifyAuthToken()}}>
                    <Text>Submit</Text>
                </Button>
            </View>
        </Form>
    </View>
)

class ConfirmTwoFactorAuth extends Component {

    state = {
        hasConfirmedTwoFactor: false,
        token: null,
    }

    copyToClipboard = (detail, message) => {
        const {
            showToast
        } = this.props
        Clipboard.setString(detail);
        showToast(message);
    }

    confirmedTwoFactor = () => {
        this.setState({
            hasConfirmedTwoFactor: true
        })
    }

    setToken = (token) => {
        this.setState({
            token
        });
    }

    verifyAuthToken = () => {
        const {
            verifyTwoFactorAuthToken
        } = this.props
        console.log(this.state.token)
        verifyTwoFactorAuthToken(this.state.token)
    }

    render () {
        const {
            goToSetPinPage,
            hasTwoFactorAuthEnabled,
            showToast,
            navigation,
        } = this.props

        return(
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                    {
                        (!this.state.hasConfirmedTwoFactor) ?
                         <ShowSecretKey
                            showToast={showToast}
                            secretKey={navigation.state.params.secretKey}
                            copyToClipboard={this.copyToClipboard}
                            confirmedTwoFactor={this.confirmedTwoFactor}
                        />
                        :
                        <ShowVerifyAuthToken
                            verifyAuthToken={this.verifyAuthToken}
                            setToken={this.setToken}
                        />
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
    hasTwoFactorAuthEnabled: state.security.hasTwoFactorAuthEnabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        enableFingerprint: () => dispatch(enableFingerprint()),
        enablePin: () => dispatch(enablePin()),
        disablePin: ()=>dispatch(disablePin()),
        enableTwoFactorAuth: () => dispatch(enableTwoFactorAuth()),
        verifyTwoFactorAuthToken: (token) => dispatch(verifyTwoFactorAuthToken(token)),
        goToValidateTwoFactorPage: (routeName='Confirm Two Factor', params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        showToast: (message) => dispatch(showToast(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ConfirmTwoFactorAuth));