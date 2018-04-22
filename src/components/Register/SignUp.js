import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, WebView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseAccent, baseColor, brandColor, lossColor,
    GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_ID_IOS } from '../../config'
import { View, Container, Header, Content, Input, Text, Button, StyleProvider } from 'native-base';
import { addExchangeAccount, logger } from '../../helpers/api';
import { withDrawer } from '../../helpers/drawer';
import { Google, SecureStore } from 'expo'
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import styles from './styles'
import { login as _login, registerAccount as _registerAccount } from '../../reducers/account'
import { setLoading as _setLoading, showToast as _showToast } from '../../reducers/ui'
import { getErrorMsg } from '../../helpers/functions'

const customStyles = {
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    heading: {
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 10,
        borderTopWidth: 0,
        borderWidth: 0
    },
    input: {
        color: '#fff',
        fontSize: 16,
        borderColor: baseAccent,
        borderBottomWidth: 1,
        paddingLeft: 10
    },
    qrContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderColor: brandColor,
        borderWidth: 1,
        paddingVertical: 10,
        marginTop: 10
    },
    qrButton: {
        flex: .3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrButtonText: {
        color: brandColor,
    },
    showAdvanced: {
        color: brandColor,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20
    },
    image: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 5
    }
}

class SignUp extends Component {

    static headerText = 'Sign Up'

    state = {
        showForm: false,
        username: '',
        password: '',
        email: '',
        inviteCode: '',
        photo: '',
        accessToken: '',
        refreshToken: '',
        serverAuthCode: ''
    }

    componentWillMount = async () => {
        const { navigation, showToast, setLoading, login } = this.props
        const { withGoogle } = navigation.state.params

        if (!withGoogle) {
            this.setState({
                showForm: true
            })
        } else {
            this.attemptGoogleLogin()
        }
    }

    attemptGoogleLogin = async () => {
        const { login, navigate, navigation, showToast, setLoading } = this.props
        try {
            const {
                accessToken,
                refreshToken,
                serverAuthCode,
                user: { email, photoUrl }
            } = await this.signInWithGoogle()
            setLoading(true, 'Connecting To Google')
            const success = await login(
                { accessToken, withGoogle: true },
                { failureRedirect: false, suppressToast: true }
            )
            setLoading(false)
            if (success) {
                console.log('logged in with Google')
                return
            }
            this.setState({
                showForm: true,
                email,
                photo: photoUrl, // TODO Render and ask if we should use this
                accessToken,
                refreshToken,
                serverAuthCode
            })
        } catch (err) {
            setLoading(false)
            logger.error('signInWithGoogle', err)
            switch(err.message) {
                case 'Google sign in error': 
                    navigate('Register')
                    break;
                case 'Account not found':
                    showToast('Continue Registration')
                    break;
                default:
                    showToast(getErrorMsg(err))
            }
        }
    }

    submit = async () => {
        const { registerAccount, navigate, navigation, login, showToast } = this.props
        const { withGoogle } = navigation.state.params
        const {
            username,
            email,
            password,
            accessToken,
            refreshToken,
            serverAuthCode,
            inviteCode
        } = this.state
        if (!username) {
            Alert.alert('Username is required.')
            return
        } else if (!email) {
            Alert.alert('Email is required')
            return
        } else if (!withGoogle && !password) {
            Alert.alert('Password is required')
            return
        } else if (!withGoogle && password.length < 6) {
            Alert.alert('Password must be 6 char min')
            return
        }
        try {
            await registerAccount({
                username,
                email,
                password,
                accessToken,
                refreshToken,
                serverAuthCode,
                withGoogle,
                invite_code: inviteCode
            })
            showToast('Account Created')
        } catch (err) {
            logger.error('submit, registerAccount', err)
            showToast(getErrorMsg(err))
        }
        if (withGoogle) {
            try {
                await login({ username, accessToken, withGoogle })
            } catch (err) {
                logger.error('SignUp withGoogle', err)
                showToast(getErrorMsg(err))
            }
        } else {
            navigate('Login')
        }
    }

    signInWithGoogle = async () => {
        return await Google.logInAsync({
            androidClientId: GOOGLE_CLIENT_ID_ANDROID,
            iosClientId: GOOGLE_CLIENT_ID_IOS,
            scopes: ['profile', 'email'],
        });
    }

    render() {
        const { navigation } = this.props
        const { withGoogle } = navigation.state.params
        const { email, username, showForm } = this.state

        return (
            <StyleProvider style={getTheme(_platform)}>
                <Container>
                    {showForm && <Content>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Enter Profile Info</Text>
                            
                            <Text style={styles.subHeading}>
                                { withGoogle && 'Create a username. Next time you sign in with Google it will be automatic. ' }
                                Your information will not be shared with third parties. 
                            </Text>
                        </View>
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Username</Text>
                            <Input
                                value={username}
                                style={customStyles.input}
                                placeholder="eg. vitalik123"
                                onChangeText={username=>this.setState({ username })}
                                autoCapitalize='none'
                             />
                        </View>
                        {!!(!withGoogle || email) &&
                            <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Email</Text>
                            <Input
                                value={email}
                                editable={!withGoogle}
                                style={customStyles.input}
                                placeholder="trader@ethereum.org"
                                onChangeText={email=>{this.setState({ email })}}
                                autoCapitalize='none'
                             />
                        </View>}
                        {!withGoogle && 
                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Password</Text>
                            <Input
                                style={customStyles.input}
                                placeholder="Minimum 6 Characters"
                                secureTextEntry={true}
                                autoCapitalize='none'
                                onChangeText={password=>{this.setState({ password })}}
                             />
                        </View>}
                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Invite Code</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="f28efyA"
                                 onChangeText={inviteCode=>{this.setState({ inviteCode })}}
                                 autoCapitalize='none'
                             />
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"Create Account"}
                                block
                                onPress={() => { this.submit() }}>
                                <Text style={{color: '#000'}}>Create Account</Text>
                            </Button>
                        </View>
                    </Content>}
                </Container>
            </StyleProvider>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        showToast: (params) => dispatch(_showToast(params)),
        setLoading: (isLoading, msg) => dispatch(_setLoading(isLoading, msg)),
        login: (params, options) => dispatch(_login(params, options)),
        registerAccount: (params) => dispatch(_registerAccount(params)),
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SignUp));
