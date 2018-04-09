import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, TouchableWithoutFeedback, WebView } from 'react-native';
import QRButton from '../Common/QRButton'
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseAccent, baseColor, brandColor, lossColor } from '../../config'
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { addExchangeAccount } from '../../helpers/api';
import { withDrawer } from '../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import styles from './styles'
import { login as _login } from '../../reducers/account'

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

class Login extends Component {

    static headerText = 'Login'

    state = {
        username: '',
        password: ''
    }

    submit = () => {
        const { login } = this.props
        const { username, password } = this.state
        if (!username) {
            Alert.alert('Username is required')
            return
        } else if (!password) {
            Alert.alert('Password is required')
            return
        }
        login({ username, password })
    }

    render() {
        return (
            <StyleProvider style={getTheme(_platform)}>
                <Container>
                    <Content>
                        <View style={customStyles.header}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Username</Text>
                            <Input
                                 style={customStyles.input}
                                 placeholder="eg. vitalik123"
                                 autoCapitalize='none'
                                 onChangeText={username=>this.setState({ username })}
                             />
                        </View>
                        <View style={[customStyles.header, {flex: 1, borderBottomWidth: 0}]}>
                            <Text style={[styles.heading, customStyles.heading, { paddingBottom: 0 }]}>Password</Text>
                            <Input
                                 style={customStyles.input}
                                 secureTextEntry={true}
                                 placeholder="******"
                                 autoCapitalize='none'
                                 onChangeText={password=>{this.setState({ password })}}
                             />
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Button
                                style={{flex: .8}}
                                primary
                                title={"Create Account"}
                                block
                                onPress={() => { this.submit() }}>
                                <Text style={{color: '#000'}}>Login</Text>
                            </Button>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
                            <Text style={{color: '#fff'}}>Forgot your password?</Text>
                            <TouchableWithoutFeedback onPress={()=>{}}>
                                <Text style={{color: brandColor}}> Click to Reset</Text>
                            </TouchableWithoutFeedback>
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
        login: (params) => dispatch(_login(params)),
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Login));