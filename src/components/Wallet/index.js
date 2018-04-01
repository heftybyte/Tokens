import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, View, AsyncStorage, Alert, TouchableHighlight, } from 'react-native';
import { Container, Header, Content, ListItem, Text, Radio, Footer, Button, CheckBox, Body, Right, List} from 'native-base';
import { withDrawer } from '../../helpers/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteWalletAddress } from '../../reducers/account';
import { connect } from 'react-redux';
import { baseColor } from '../../config'

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: baseColor,
        height: '100%',
        padding: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: baseColor,
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#f00'
    },
    header: {
        backgroundColor: baseColor,
        color:'#fff',
        textAlign: 'center',
        fontSize: 20
    },
    white: {
        color :'#fff',
    },
    address: {
        fontSize: 10,
        color: "#fefefe"
    },
    color: {
        color: '#fefefe',
    },
    removeAddressBtn: {
        flex: .1
    },
});


const ViewWallet = ({ wallets, deleteAddress } = props) => {
    return( <Content>
            <Text style={styles.white}>Your current Ethereum Address</Text>

            {
                wallets.map((wallet, index) => <View style={{flex: .1}} key={index}>
                    <Text style={styles.address}>{wallet['id']}</Text>
                    <Right style={{flex:.1}}>
                    <TouchableHighlight
                        style={styles.removeAddressBtn}
                        onPress={() => {deleteAddress(wallet['id'])}}>
                        <MaterialCommunityIcons
                            name="minus-circle-outline"
                            size={22}
                            color="#b63e15"
                        /></TouchableHighlight>
                    </Right>
                        </View>
                 )

            }

            <Text style={styles.white}>Transaction History</Text>
        </Content>
    )
}

const CreateWallet = ({ onNewWallet, onRestoreWallet, onContinue, new_wallet, restore_wallet } = props) => {
    return( <View style={{flex: 1}}>
    <Content>

        <Text style={styles.header}>Your Ethereum Wallet</Text>
        <List>
            <ListItem
                onPress={onNewWallet}
            >
                <CheckBox
                    checked={new_wallet}
                    onPress={onNewWallet} />
                <Body>
                <Text style={styles.color}>CREATE NEW WALLET</Text>
                </Body>
            </ListItem>
            <ListItem
                onPress={onRestoreWallet}
            >
                <CheckBox
                    checked={restore_wallet}
                    onPress={onRestoreWallet} />
                <Body>
                <Text style={styles.color}>PAIR / RESTORE WALLET</Text>
                </Body>
            </ListItem>
        </List>
    </Content>
    <Footer>
    <Right>
        <Button transparent success onPress={onContinue}>
            <Text>CONTINUE</Text>
        </Button>
    </Right>
    </Footer>
    </View>
    )
}

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

    onContinue = () => {
        if(this.state.new_wallet){
        	this.props.navigate('New Wallet', {})
            return
        }
        this.props.navigate('Restore Wallet', {})
    }

    render() {
        const { wallets, deleteWalletAddress } = this.props;
        const {new_wallet, restore_wallet} = this.state;
        return(
            <Container>
                {
                    (wallets.length == 0)?
                        <CreateWallet
                            new_wallet={new_wallet}
                            restore_wallet={restore_wallet}
                            onNewWallet={this.onNewWallet.bind(this)}
                            onRestoreWallet={this.onRestoreWallet.bind(this)}
                            onContinue={this.onContinue.bind(this)}
                        />
                        :
                        <ViewWallet
                            wallets={wallets}
                            deleteAddress={deleteWalletAddress}
                        />

                }
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
        deleteWalletAddress: (address) => dispatch(deleteWalletAddress(address)),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Wallet));
