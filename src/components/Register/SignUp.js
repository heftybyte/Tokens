import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, WebView } from 'react-native';
import QRButton from '../Common/QRButton'
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseAccent, baseColor, brandColor, lossColor,
    GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_ID_IOS } from '../../config'
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { addExchangeAccount } from '../../helpers/api';
import { withDrawer } from '../../helpers/drawer';
import { Google, SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import styles from './styles'
import { registerAccount as _registerAccount } from '../../reducers/account'

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
        username: '',
        password: '',
        email: '',
        inviteCode: ''
    }

    componentWillMount = async () => {
        const { navigation } = this.props
        const { withGoogle } = navigation.state.params

        if (withGoogle) {
            const accessToken = await this.signInWithGoogle()
            const userInfo = await this.getUserInfo(accessToken)
            this.setState({
                email: userInfo.email
            })
        }
    }

    submit = async () => {
        const { registerAccount, navigate } = this.props
        const { username, email, password, inviteCode } = this.state
        if (!username) {
            Alert.alert('Username is required.')
            return
        } else if (!email) {
            Alert.alert('Email is required')
            return
        } else if (!password) {
            Alert.alert('Password is required')
            return
        } else if (password.length < 6) {
            Alert.alert('Password must be 6 char min')
            return
        }
        await registerAccount({ username, email, password, invite_code: inviteCode })
        navigate('Login')
    }

    signInWithGoogle = async () => {
      try {
        const result = await Google.logInAsync({
          androidClientId: GOOGLE_CLIENT_ID_ANDROID,
          iosClientId: GOOGLE_CLIENT_ID_IOS,
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
    }

    getUserInfo = async (accessToken) => {
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}`},
        });
        const userInfo = await userInfoResponse.json()
        return userInfo;
    }

    render() {
        const { navigation } = this.props
        const { withGoogle } = navigation.state.params
        const { email, username } = this.state

        return (
            <StyleProvider style={getTheme(_platform)}>
                <Container>
                    <Content>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Enter Profile Info</Text>
                            
                            <Text style={styles.subHeading}>
                                { withGoogle && 'Create a username and password. Next time you sign in with Google it will be automatic. ' }
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
                        <View style={[customStyles.header, {flex: 1}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Email</Text>
                            <Input
                                value={email}
                                style={customStyles.input}
                                placeholder="trader@ethereum.org"
                                onChangeText={email=>{this.setState({ email })}}
                                autoCapitalize='none'
                             />
                        </View>
                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Password</Text>
                            <Input
                                style={customStyles.input}
                                placeholder="Minimum 6 Characters"
                                secureTextEntry={true}
                                autoCapitalize='none'
                                onChangeText={password=>{this.setState({ password })}}
                             />
                        </View>
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
                    </Content>
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
        registerAccount: (params) => dispatch(_registerAccount(params)),
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SignUp));