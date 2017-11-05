import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  text:{
      color: '#fff',
  },
  centerText: {
    textAlign: 'center'
  }
});


class Entry extends Component {

  render(){
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000'
        }}
      >
        <Spinner
            visible={this.props.isLoading}
            textContent={this.props.loadText||''}
            textStyle={{color: '#FFF', fontSize: 16}}
            overlayColor='rgba(0,0,0,.9)'
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        ...state.ui
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Entry);
