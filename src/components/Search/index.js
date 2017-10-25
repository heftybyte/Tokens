import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import SearchBar from 'react-native-searchbar';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
});

class SearchPage extends Component {

    _handleResults = () => {}
    _handleSearch = () => {}
    render(){
        return (
            <SearchBar
                ref={(ref) => this.searchBar = ref}
                data={this.props.tokens}
                handleSearch={this._handleSearch}
                handleResults={this._handleResults}
                showOnLoad={true}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTokens: () => dispatch(fetchTokens())
  }
}


export default connect(null, mapDispatchToProps)(CreateAddress);
