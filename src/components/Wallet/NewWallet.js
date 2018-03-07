/**
 * Created by Samparsky on 07/03/2018.
 */
import React, { Component } from 'react';
import QRScanner from './../Common/QRScanner';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { GenerateMnemonic } from '../../helpers/wallet'

const ethers = require('ethers')

class NewWallet extends Component {

    createWallet(){
        const mnemonic = GenerateMnemonic()

        const wallet = Wallet.fromMnemonic(mnemonic);

        console.log("Address: " + wallet.address);



    }

    render() {
        return (
            <Container>
                <Content>

                </Content>
            </Container>
        )
    }
}