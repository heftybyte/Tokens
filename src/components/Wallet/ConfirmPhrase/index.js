import React, { Component } from 'react';
import { Alert, WebView, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
	Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form, StyleProvider } from 'native-base';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { withDrawer } from '../../../helpers/drawer';
import { addWalletAddress } from '../../../reducers/account';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';
import { getErrorMsg } from '../../../helpers/functions';
import { generateAddressFromMnemonic, storeWallet } from '../../../helpers/wallet';
import styles from '../styles'
import getTheme from '../../../../native-base-theme/components';
import platform from '../../../../native-base-theme/variables/platform';
import { setLoading, showToast } from '../../../reducers/ui'

class ConfirmPhrase extends Component {
	state = {
		mnemonic: ""
	}

	createWallet = async(mnemonic, type='ethereum') => {

		const { addWalletAddress, showLoading, showToast } = this.props

		try {
			showLoading(true, 'Generating Wallet')
			const wallet = await generateAddressFromMnemonic(mnemonic);
			showLoading(false)

			if(wallet){
				const { address, privateKey } = wallet
				const result = await storeWallet(type, privateKey, address)
				await addWalletAddress(address, 'ethereum');

				if (err){
					console.log(err)
				}
			}
		} catch (err) {
			showLoading(false)
			console.log(err)
			showToast(getErrorMsg(err))
		}

	}

	onContinue = (mnemonic) => {
		if(mnemonic == this.state.mnemonic){
			this.createWallet(mnemonic)
			return
		}

		Alert.alert('Incorrect, Please Secure the Phrase Carefully')
	}


	render() {
		const { mnemonic } = this.props
		return (
			<StyleProvider style={getTheme(platform)}>
				<Container>
					<Content>
						<View style={styles.header}>
							<Text style={styles.heading}>Confirm Backup Phrase</Text>
							<Text style={styles.subHeading}>
                                Confirm your 12-word backup phrase. Keep a written copy saved and secured. This phrase gives access to your wallet funds and as such it shouldn't be shared with anyone.
                            </Text>
							<Text style={[styles.subHeading, {color: '#ff0000'}]}>
								WARNING: Your passphrase is automatically generated and stored on this device. We will never have access to it. If you lose it, we will not be able to recover it for you and you will lose access to your funds. Keep it safe.
							</Text>
						</View>
						<View style={{marginTop: 20,marginBottom: 50, paddingHorizontal:20}}>
							<Form>
								<Item>
									<Input
										style={styles.mnemonic}
										placeholder="Enter Backup Phrase"
										multiline
										numberOfLines={4}
										onChangeText={(text)=>{this.setState({mnemonic: text})}}
										bordered
									/>
								</Item>
							</Form>
						</View>
						<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
	                        <Button style={{flex: .8}} block primary onPress={() => { this.onContinue(mnemonic) }}>
								<Text style={{color: '#000'}}>Confirm</Text>
							</Button>
						</View>
					</Content>
				</Container>
			</StyleProvider>
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
		addWalletAddress: (address, platform) => dispatch(addWalletAddress(address, platform)),
		showToast: (params) => dispatch(showToast(params)),
        setLoading: (isLoading, msg) => dispatch(setLoading(isLoading, msg))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ConfirmPhrase));