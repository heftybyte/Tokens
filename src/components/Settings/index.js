import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';

import { trackTap } from '../../helpers/analytics'
import { logout as _logout } from '../../reducers/account';

const styles = StyleSheet.create({
    white: {
        color: '#fff',
    },
    grey: {
        color: '#4c4c4c'
    }
})

class Settings extends Component {
    state = {}

    onChange(page='security') {

        const {
            goToFingerprintPage,
            navigate
        } = this.props

        switch (page){
            case 'security':
                goToFingerprintPage();
                break;
            case 'two-auth':
                break;
            case 'profile':
                navigate('Edit Profile')
                break;
        }
    }

    render () {
        const { logout } = this.props
        return(
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.white}>Profile Settings</Text>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('profile')}} noBorder>
                            <Body>
                                <Text style={styles.white}>Update Profile Info</Text>
                                <Text style={styles.grey}>Image, Username, Password, Email..etc</Text>
                            </Body>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem itemHeader first>
                            <Text style={styles.white}>Device settings</Text>
                        </ListItem>
                        <ListItem onPress={()=>{this.onChange('security')}} noBorder>
                            <Body>
                                <Text style={styles.white}>Security Settings</Text>
                                <Text style={styles.grey}>Fingerprint</Text>
                            </Body>
                        </ListItem>
                        <ListItem noBorder>
                            <Body>
                                <Text style={styles.white}>Two-factor authentication</Text>
                                <Text style={styles.grey}>Disabled</Text>
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
    wallets: state.account.wallets,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        goToFingerprintPage: (params={}) => dispatch(NavigationActions.navigate({ routeName: 'SecuritySettings', params })),
        logout: () => { dispatch(_logout()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Settings));
