/**
 * Created by Samparsky on 07/03/2018.
 */
import React, { Component } from 'react';
import QRScanner from './../Common/QRScanner';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form} from 'native-base';
import { GenerateMnemonic } from '../../helpers/wallet'
import { SecureStore} from 'expo'
import { constants } from '../../constants';
import { connect } from 'react-redux';

class NewWallet extends Component {

    createWallet = async() => {
        const mnemonic = await GenerateMnemonic()
        SecureStore.setItemAysnc(constants.wallet.mnemonic, mnemonic)
    }

    render() {
        return (
            <Container>
                <Content>
                    <ListItem>
                        <Form>
                            <Item stackedLabel>
                                <Label>Username</Label>
                                <Input />
                            </Item>
                        <Text>Your Phrase</Text>
                        <Text>Please kindly write down the phrase you would be required
                        to re enter it in the next stage.</Text>
                        <Input
                            multiline
                            numberOfLines={4}
                        />
                        </Form>
                    </ListItem>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    portfolio: state.account.portfolio,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewWallet);
