import React, { Component } from 'react';
import { Alert, Image, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { baseColor, brandColor } from '../../config'
import { View, Container, Header, Content, Input, Text, Button, StyleProvider } from 'native-base';
import { withDrawer } from '../../helpers/drawer';
import { connect } from 'react-redux';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import styles from './styles'

const customStyles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
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
    imageContainer: {
        flex: .6,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 50
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginVertical: 10
    },
    image: {
        width: 150,
        height: 132.5
    },
    buttonContainer: {
        flex: .4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flex: .5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#000',
        flex: .5
    },
    googleButton: {
        backgroundColor: '#fff'
    }
}

class Register extends Component {

    static hideHeader = true

    state = {
        username: '',
        password: '',
        email: ''
    }

    submit = () => {
        const { username, email, password } = this.state
        console.log({ username, email, password })
    }

    render() {
        const { navigate } = this.props
        return (
            <StyleProvider style={getTheme(_platform)}>
                <Container>
                    <Content style={customStyles.container}>
                        <View style={customStyles.imageContainer}>
                            <Image source={require('../../../assets/Tokens_Icon.png')} style={customStyles.image} />
                            <Text style={customStyles.title}>Tokens Express</Text>
                        </View>
                        <View style={customStyles.buttonContainer}>
                            <View style={customStyles.button}>
                                <Button
                                    style={[{flex: 1}, customStyles.googleButton]}
                                    primary
                                    title={"Continue With Google"}
                                    block
                                    onPress={() => navigate('SignUp', { withGoogle: true })}>
                                    <FontAwesome style={{flex: .1, padding: 10, paddingRight: 0}} color={baseColor} name={'google'} size={30} />
                                    <Text style={customStyles.buttonText}>CONTINUE WITH GOOGLE</Text>
                                </Button>
                            </View>
                            <View style={customStyles.button}>
                                <Button
                                    style={{flex: 1}}
                                    primary
                                    title={"Sign Up With Email"}
                                    block
                                    onPress={() => navigate('SignUp')}>
                                    <MaterialCommunityIcons style={{flex: .1 }} color={baseColor} name={'email'} size={30} />
                                    <Text style={customStyles.buttonText}>SIGN UP WITH EMAIL</Text>
                                </Button>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}>
                                <Text style={{color: '#fff'}}>Already have an account?</Text>
                                <TouchableWithoutFeedback onPress={()=>navigate('Login')}>
                                    <Text style={{color: brandColor}}> Sign in.</Text>
                                </TouchableWithoutFeedback>
                            </View>
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
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Register));