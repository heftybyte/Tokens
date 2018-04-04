import React, { Component } from 'react';
import { Alert, WebView, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form } from 'native-base';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { withDrawer } from '../../../helpers/drawer';
import { addWalletAddress } from '../../../reducers/account';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';
import { generateAddressFromMnemonic, storeWallet } from '../../../helpers/wallet';

const styles = StyleSheet.create({
    input: {
        color: '#fff',
    },
    mnemonic: {
        color: "#f3f3f3",
        fontSize: 24,
    },
    title: {
        fontSize: 36,
        color: "#f3f3f3"
    }
});

class ConfirmPhrase extends Component {
	state = {
		mnemonic: ""
	}

    createWallet = async(mnemonic, type='ethereum') => {

        const { addWalletAddress } = this.props

        const wallet = await generateAddressFromMnemonic(mnemonic);

        if(wallet){
            const { address, privateKey } = wallet
            const result = await storeWallet(type, privateKey, address)
            const err = await addWalletAddress(address);

            if (err){
                console.log(err)
            }
        }

    }

    onContinue = (mnemonic) => {
		if(mnemonic == this.state.mnemonic){
			Alert.alert('Correct')
			this.createWallet(mnemonic)
            return
		}

		Alert.alert('Incorrect')
    }


	render() {
        const { mnemonic } = this.props
		return (
			<Container>
				<Content>
					<Text style={styles.title}>Confirm Seed Phrase</Text>
					<View style={{marginTop: 20,marginBottom: 50}}>
						<Form>
    						<Item>
        						<Input
        							style={styles.input}
        							placeholder="Enter Seed Phrase"
        							multiline
        							numberOfLines={4}
        							onChangeText={(text)=>{this.setState({mnemonic: text})}}
        							bordered
        						/>
    						</Item>
						</Form>
					</View>
					<Button block primary onPress={() => { this.onContinue(mnemonic) }}>
                    	<Text>Confirm</Text>
                	</Button>

				</Content>
			</Container>
		)
	}
}

const mapStateToProps = (state, props) => ({
    portfolio: state.account.portfolio,
    ...props.navigation.state.params,
    ...state.ui
})

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params })),
        addWalletAddress: (address) => dispatch(addWalletAddress(address)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ConfirmPhrase));