import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { baseColor, lossColor, brandColor } from '../../config'
import { Button, StyleProvider,  } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import _platform from '../../../native-base-theme/variables/platform';
import { withDrawer } from '../../helpers/drawer';
import { createPriceAlert } from '../../reducers/alert'

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: baseColor
    },
    container: {
        display: 'flex',
        borderColor: '#fff',
        justifyContent: 'space-between',
        backgroundColor: baseColor,
        marginBottom: 10,
        flexDirection: 'row',
        paddingLeft: 20
    },
    containerChild: {
        marginBottom: 15,
        flexGrow: .5,
        flexBasis: 1,
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    textInput: {
        height: 30,
        fontSize: 14,
        width: '50%',
        borderColor: 'gray',
        borderBottomWidth: 1,
        color: '#fff'
    },
    horizontalLine: {
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        marginTop: 15,
        marginBottom: 15
    }
})

const radioProps = [
    {label: 'One Time', value: 0 },
    {label: 'Continuous', value: 1 }
]

const priceLevel = [
    {label: 'More than', value: 0 },
    {label: 'Less than', value: 1 }
]

class CreatePriceAlert extends Component {
    state = {
        radioValue: 0,
        frequency: 0,
        price: 0,
        type: 0,
    }

    submit = () => {
        const {currencySymbol, currency, createPriceAlert } = this.props;
        if(this.state.price <= 0) {
            Alert.alert('Please enter a correct price value');
            return
        }
        console.log({
            fsym : currencySymbol,
            tsym: currency,
            price: this.state.price,
            type: this.state.type,
            frequency: this.state.frequency
        })
        createPriceAlert({
            fsym : currencySymbol,
            tsym: currency,
            price: parseFloat(this.state.price),
            type: parseInt(this.state.type),
            frequency: parseInt(this.state.frequency)
        })
    }

    render() {
        const { tokenDetails, edit, price } = this.props

        return (
            <StyleProvider style={getTheme(_platform)}>
                <ScrollView
                    style={styles.scrollContainer}
                    containerStyleContent={styles.container}
                >
                    <View style={[styles.containerChild, {justifyContent: 'flex-start', padding: 35, paddingBottom: 0}]}>
                        <Text style={{color: '#666'}}>THRESHOLD</Text>
                    </View>

                    <View style={styles.containerChild}>
                        <Text style={{color: '#fff'}}>PRICE</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(price) => this.setState({price})}
                            keyboardType='numeric'
                            placeholder={'Enter numeric value'}
                            placeholderTextColor='#444'
                        />
                    </View>

                    <View style={styles.containerChild}>
                        <Text style={{color: '#fff'}}>Current</Text>
                        <TextInput
                            style={styles.textInput}
                            keyboardType='numeric'
                            placeholder={''}
                            placeholderTextColor='#444'
                            editable={false}
                            value={price}
                        />
                    </View>

                    <View style={[styles.containerChild, {
                        justifyContent: 'flex-start',
                        paddingHorizontal: 35,
                        marginTop: 20
                      }]
                      }>
                        <Text style={{color: '#666'}}>WHEN THE PRICE IS </Text>
                    </View>
                    <View
                        style={[styles.containerChild,
                         {
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: 35
                          }
                        ]}>
                        <RadioForm
                            radio_props={priceLevel}
                            formHorizontal={true}
                            labelHorizontal={true}
                            labelStyle={{color: '#fff', paddingRight: 10}}
                            buttonColor={brandColor}
                            selectedButtonColor={brandColor}
                            initial={0}
                            onPress={(value) => {this.setState({type: value})}}
                        />
                    </View>

                    <View style={[styles.containerChild, {
            justifyContent: 'flex-start',
            paddingHorizontal: 35,
            marginTop: 20
          }]
          }>
                        <Text style={{color: '#666'}}>FREQUENCY</Text>
                    </View>

                    <View
                        style={[styles.containerChild,
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingHorizontal: 35
              }
            ]}>
                        <RadioForm
                            radio_props={radioProps}
                            formHorizontal={true}
                            labelHorizontal={true}
                            labelStyle={{color: '#fff', paddingRight: 10}}
                            buttonColor={brandColor}
                            selectedButtonColor={brandColor}
                            initial={0}
                            onPress={(value) => {this.setState({frequency: value})}}
                        />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Button
                            style={{flex: .8}}
                            primary
                            title={"Create Alert"}
                            block
                            onPress={() => { this.submit() }}>
                            <Text style={{color: '#000'}}>Create Alert</Text>
                        </Button>
                    </View>

                </ScrollView>
            </StyleProvider>

        )
    }
}


const mapStateToProps = (state, props) => ({
    tokenDetails: state.account.tokenDetails,
    portfolio: state.account.portfolio,
    currency: state.account.preference.currency,
    ...props.navigation.state.params,
})

const mapDispatchToProps = (dispatch) => ({
    createPriceAlert: (data) => dispatch(createPriceAlert(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(CreatePriceAlert));