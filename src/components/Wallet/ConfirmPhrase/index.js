/**
 * Created by Samparsky on 19/03/2018.
 */
import React, { Component } from 'react';
import { WebView, StyleSheet, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { View, Container, Header, Content, ListItem, Input,Text,
    Radio, Footer, Button, CheckBox, Body, Right, List, Label, Item, Form } from 'native-base';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { withDrawer } from '../../../helpers/drawer';
import { SecureStore} from 'expo'
import { constants } from '../../../constants';

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

	getMnemonic = (fn) => {
        SecureStore.getItemAsync(constants.wallet.mnemonic).then((data) => {
            console.log(data)
            Alert.alert(data)
            fn(data);
            return
        }).catch(function(e){

        })
        
    }

    onContinue = () => {
    	this.getMnemonic( (mnemonic) => {
    		if(mnemonic == this.state.mnemonic){
    			Alert.alert('Correct')
    			return
    		}

    		Alert.alert('Incorrect')
    	})
    }


	render() {
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

					<Button block primary onPress={() => { this.onContinue() }}>
                    	<Text>Confirm</Text>
                	</Button>

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

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(ConfirmPhrase));