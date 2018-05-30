import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';

import { trackTap } from '../../helpers/analytics'
import { logout as _logout } from '../../reducers/account';

const styles = StyleSheet.create({
    header: {
        color: '#fff',
        fontSize: 14
    },
    white: {
        color: '#fff',
    },
    optionDescription: {
        marginTop: 10,
        color: '#4c4c4c'
    }
})

class Settings extends Component {
    state = {}

    onChange(page='security') {

        const {
            goToFingerprintPage,
            goToTwoFactorAuthPage,
            navigate
        } = this.props

        switch (page){
            case 'security':
                goToFingerprintPage();
                break;
            case 'two-auth':
                goToTwoFactorAuthPage();
                break;
            case 'profile':
                navigate('Edit Profile')
                break;
            case 'currency':
                navigate('Set Currency')
                break;
        }
    }

    render () {
        const {
            logout,
            preference,
            hasPinEnabled,
            hasFingerprintEnabled,
            hasTwoFactorAuthEnabled,
        } = this.props

        return(
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.header}>Profile Settings</Text>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('profile')}} noBorder>
                            <Body>
                                <Text style={styles.white}>Update Profile Info</Text>
                                <Text style={styles.optionDescription}>Username, Password, Email..etc</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('currency')}} noBorder>
                          <Body>
                            <Text style={styles.white}>
                              Set Currency
                            </Text>
                            <Text style={styles.optionDescription}>
                              {preference.currency}
                            </Text>
                          </Body>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.header}>Device settings</Text>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('security')}} noBorder>
                            <Body>
                                <Text style={styles.white}>Security Settings</Text>
                                {
                                    (hasPinEnabled)?
                                        <Text style={styles.optionDescription}>Pin</Text>
                                        :
                                        (hasFingerprintEnabled) ?
                                            <Text style={styles.optionDescription}>Fingerprint</Text>
                                            :
                                            <Text style={styles.optionDescription}>None</Text>
                                }
                            </Body>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('two-auth')}} noBorder>
                            <Body>
                                <Text style={styles.white}>Two-Factor Authentication</Text>
                                {
                                    (!hasTwoFactorAuthEnabled) ?
                                    <Text style={styles.optionDescription}>Disabled</Text>
                                    :
                                    <Text style={styles.optionDescription}>Enabled</Text>
                                }
                            </Body>
                        </ListItem>
                        <ListItem onPress={()=>{trackTap('Logout');logout()}} noBorder>
                            <Body>
                                <Text style={styles.white}>Logout</Text>
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
    preference: state.account.preference,
    wallets: state.account.wallets,
    hasPinEnabled: state.security.hasPinEnabled,
    hasFingerprintEnabled: state.security.hasFingerprintEnabled,
    hasTwoFactorAuthEnabled: state.account.two_factor_enabled,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        goToFingerprintPage: (params={}) => dispatch(NavigationActions.navigate({ routeName: 'SecuritySettings', params })),
        logout: () => { dispatch(_logout()) },
        goToTwoFactorAuthPage:(params={}) => dispatch(NavigationActions.navigate({ routeName: '2FA', params })),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Settings));
