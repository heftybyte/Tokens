import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { createIncrementAction } from '../actionCreators';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export class Main extends Component{
    render = () => (
        <View style={styles.container}>
          <Text>Click to Increment the Counter</Text>
          <Text>Counter: { this.props.count}</Text>
          <Button onPress={this.props.incrementCount} title={"Click Here"} />
          <Text>Shake your phone to open the developer menu.</Text>
        </View>
      );
}

const stateToProps = (state) => {
    return {
        count: state.count
    }
}

const dispatchToProps = (dispatch) => {
    return {
        incrementCount: () => dispatch(createIncrementAction)
    }
}

export default connect(stateToProps, dispatchToProps)(Main);