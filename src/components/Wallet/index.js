import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { withDrawer } from '../../helpers/drawer';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#000',
        height: '100%',
        padding: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#000',
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#f00'
    },
    header: {
        backgroundColor: '#000',
        color:'#fff',
        textAlign: 'center',
        fontSize: 20
    },
    color: {
        color :'#fff'
    }
});

class Wallet extends Component {
    state = {
        new_wallet: true,
        restore_wallet: false
    }

    onNewWallet = () => {
        this.setState({ new_wallet: true, restore_wallet: false})
    }

    onRestoreWallet = () => {
        this.setState({ new_wallet: false, restore_wallet: true})
    }

    render() {
        return(
            <Container>
                <Content>

                    <Text style={styles.header}>Your Ethereum Wallets</Text>
                    <List>
                    <ListItem
                        onPress={this.onNewWallet.bind(this)}
                    >
                        <CheckBox
                            checked={this.state.new_wallet}
                            onPress={this.onNewWallet.bind(this)} />
                        <Body>
                        <Text style={styles.color}>CREATE NEW WALLET</Text>
                        </Body>
                    </ListItem>
                    <ListItem
                        onPress={this.onRestoreWallet.bind(this)}
                    >
                        <CheckBox
                            checked={this.state.restore_wallet}
                            onPress={this.onRestoreWallet.bind(this)} />
                        <Body>
                        <Text style={styles.color}>PAIR / RESTORE WALLET</Text>
                        </Body>
                    </ListItem>
                    </List>
                </Content>
                <Footer>
                    <Right>
                        <Button transparent success>
                            <Text>CONTINUE</Text>
                        </Button>
                    </Right>
                </Footer>
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
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Wallet));
