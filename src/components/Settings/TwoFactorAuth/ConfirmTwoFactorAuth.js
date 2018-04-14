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

const ShowSecretKey = ({showToast, secretKey, copyToClipboard, confirmedTwoFactor}=props) => (
    <Content style={{paddingHorizontal: 10}}>
        <Text style={styles.heading}>Manual Entry</Text>
        <Text style={styles.subHeading}>Please enter the secret key and label below into the google authenticator app via manual
        entry.</Text>
            <Item>
                <Label style={styles.subHeading}>Account:</Label>
                <Input
                    style={styles.subHeading}
                    bordered
                    disabled
                    value="Tokens Express"
                />
                <Button primary
                        onPress={()=>{
                            copyToClipboard('Tokens Express','Account copied to your Clipboard')
                        }}>
                    <Text>Copy</Text>
                </Button>
            </Item>
            <Item style={{marginTop: 10}}>
                <Label style={styles.subHeading}>Secret Key:</Label>
                <Input
                    style={styles.subHeading}
                    bordered
                    disabled
                    value={secretKey}
                />
                <Button
                    primary
                    onPress={()=>{copyToClipboard(secretKey, 'Secret Key copied to your Clipboard')}}
                ><Text>Copy</Text></Button>
            </Item>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 30}}>
            <Button
                primary
                block
                onPress={()=>{confirmedTwoFactor()}}>
                <Text>Continue</Text>
            </Button>
        </View>
    </Content>
)

const ShowVerifyAuthToken = ({verifyAuthToken, setToken}=props) => (
    <Content  style={{paddingHorizontal: 20}}>
        <Text style={styles.heading}>Verify Two Factor Auth</Text>
        <Form>
            <Item>
                <Label style={styles.subHeading}>Code:</Label>
                <Input
                    style={styles.mnemonic}
                    placeholder="Enter Two Factor Token"
                    multiline
                    onChangeText={(text)=>{setToken(text)}}
                    bordered
                />
            </Item>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 20}}>
                <Button
                    primary
                    block
                    onPress={()=>{verifyAuthToken()}}>
                    <Text>Submit</Text>
                </Button>
            </View>
        </Form>
    </Content>
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
        verifyTwoFactorAuthToken({token: this.state.token, confirm:true})
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
        verifyTwoFactorAuthToken: ({token, confirm,login}) => dispatch(verifyTwoFactorAuthToken({token, confirm,login})),
        goToValidateTwoFactorPage: (routeName='Confirm 2FA', params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        showToast: (message) => dispatch(showToast(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ConfirmTwoFactorAuth));