/**
 * Created by Samparsky on 07/03/2018.
 */
import React, { Component } from 'react';
import QRScanner from './../Common/QRScanner';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';

class RestoreWallet extends Component {
    render(){
        return(
            <Container>
                <Content>
                    <ListItem>
                        <Text>Enter Your Backup Phrase</Text>
                    </ListItem>
                    <ListItem>
                        <Input
                            multiline
                            numberOfLines={4}
                            />
                        <Text>OR BETTER YET</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Scan QR Code</Text>
                    </ListItem>
                    <View style={{flex:1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <MaterialCommunityIcons
                            name="qrcode"
                            size={20}
                            color="white"
                            style={{marginRight: 10}}
                        />
                        <Text style={[styles.buttonText]}>{scannerOpen ? 'CLOSE' :'SCAN'}</Text>
                    </View>
                </Content>
            </Container>
        )

    }
}