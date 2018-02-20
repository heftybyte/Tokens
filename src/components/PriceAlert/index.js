import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { lossColor, brandColor } from '../../config'

import { withDrawer } from '../../helpers/drawer';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    display: 'flex',
    borderColor: '#fff',
    justifyContent: 'space-between',
    backgroundColor: '#000',
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

class PriceAlert extends Component {
  state = {
    radioValue: 0
  }

  render() {
    const { tokenDetails } = this.props

    return (
      <ScrollView
        style={styles.scrollContainer}
        containerStyleContent={styles.container}
        >
          <View style={[styles.containerChild, {justifyContent: 'flex-start', padding: 35, paddingBottom: 0}]}>
            <Text style={{color: '#666'}}>THRESHOLD</Text>
          </View>

          <View style={styles.containerChild}>
            <Text style={{color: '#fff'}}>Above</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              keyboardType='numeric'
              placeholder={'Enter numeric value'}
              placeholderTextColor='#444'
            />
          </View>

          <View style={styles.containerChild}>
            <Text style={{color: '#fff'}}>Current</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              keyboardType='numeric'
              placeholder={''}
              placeholderTextColor='#444'
            />
          </View>

          <View style={styles.containerChild}>
            <Text style={{color: '#fff'}}>Below</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              keyboardType='numeric'
              placeholder={'Enter Numeric value'}
              placeholderTextColor='#444'
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
              onPress={(value) => {this.setState({radioValue: value})}}
            />
          </View>

      </ScrollView>
    )
  }
}


const mapStateToProps = (state, props) => ({
    tokenDetails: state.account.tokenDetails,
    portfolio: state.account.portfolio,
})

export default connect(mapStateToProps)(withDrawer(PriceAlert));