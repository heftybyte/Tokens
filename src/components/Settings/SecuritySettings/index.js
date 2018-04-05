import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, Platform } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { Fingerprint } from 'expo'
import { getPin, deletePin } from '../../../helpers/security'
import { enableFingerprint, enablePin, disablePin } from '../../../actions/security';

const styles = StyleSheet.create({
    white: {
        color :'#fff',
    },
    grey: {
        color: '#4c4c4c'
    }
})

class SecuritySettings extends Component {
    state = {
        'hasFingerprint': false,
        'authFingerprint': false,
    }

    authFingerprint = async function() {

        const result = Platform.OS === 'ios'
            ? await Fingerprint.authenticateAsync('Kindly place your finger')
            : await Fingerprint.authenticateAsync();

        return result.success
    }

    async componentDidMount() {
        console.log(this.props.hasFingerprint)
        const hasFingerprint = await Fingerprint.hasHardwareAsync();
        const isEnrolled = await Fingerprint.isEnrolledAsync();

        if(hasFingerprint && isEnrolled){
            this.setState({
                'hasFingerprint': true
            })
        }
    }

    enableFingerprint = async function (){
        if(!this.state.hasFingerprint){
            Alert.alert('Sorry couldn\'t enable fingerprint')
            return
        }
        const authFingerprint = await this.authFingerprint()

        if(!authFingerprint){
            Alert.alert('Sorry couldn\'t enable fingerprint')
            return
        }

        this.props.enableFingerprint();

        Alert.alert('Successfully enabled fingerprint')
    }

    enablePin = async function(){
        const {
            hasPinEnabled,
            goToSetPinPage,
            enablePin,
            disablePin,
        } = this.props

        if(hasPinEnabled){
            Alert.alert(
                'Disable Pin',
                'Will you like to disable pin?',
                [
                    {text: 'Cancel', onPress: () => {}},
                    {text: 'OK', onPress: () => {
                        disablePin();
                        Alert.alert('Pin disabled');
                        deletePin();
                    }},
                ],
                { cancelable: true }
            )
            return
        }

        Alert.alert(
            'Enable Pin',
            'Will you like to enable pin?',
            [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {enablePin();goToSetPinPage();}, style: 'cancel'},
            ],
            { cancelable: true }
        )
    }

    render () {
        const {
            hasFingerprintEnabled,
            hasPinEnabled,
            goToSetPinPage
        } = this.props

        return(
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.white}>Fingerprint</Text>
                        </ListItem>
                        <ListItem onPress={this.enableFingerprint.bind(this)} noBorder>
                            <Body>
                            <Text style={styles.white}>Enable Fingerprint authentication</Text>
                            </Body>
                            <Right>
                                <CheckBox
                                    checked={hasFingerprintEnabled}
                                />
                            </Right>
                        </ListItem>
                        <ListItem itemHeader first>
                            <Text style={styles.white}>PIN Code</Text>
                        </ListItem>
                        <ListItem onPress={this.enablePin.bind(this)} noBorder>
                            <Body>
                            <Text style={styles.white}>Enable PIN</Text>
                            <Text style={styles.grey}>PIN is used as the backup authentication method for fingerprint</Text>
                            </Body>
                            <Right>
                                <CheckBox
                                    checked={hasPinEnabled}
                                />
                            </Right>
                        </ListItem>
                        <ListItem onPress={()=>{goToSetPinPage()}} noBorder>
                            <Body>
                            <Text style={styles.white}>Set PIN</Text>
                            <Text style={styles.grey}>You will be automatically signed out of your account after 3 consecutive failed PIN code attempts</Text>
                            </Body>
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
    hasPinEnabled: state.security.hasPinEnabled,
    hasFingerprintEnabled: state.security.hasFingerprintEnabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        enableFingerprint: () => dispatch(enableFingerprint()),
        enablePin: () => dispatch(enablePin()),
        disablePin: ()=>dispatch(disablePin()),
        goToSetPinPage: (routeName='SetPin', params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SecuritySettings));