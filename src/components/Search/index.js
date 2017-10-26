import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';
import { fetchTokens } from '../../actions/search';
import TokenList from '../TokenList';

const styles = StyleSheet.create({
});

class SearchPage extends Component {
    state = {
      tokens: []
    }

    searchBar = null;

    componentWillMount(){
      console.log('mounting');
      this.props.fetchTokens();
    }

    componentWillReceiveProps(nextProps){
      console.log(nextProps, 'nextProps');
    }

    handleSearch = (searchTerm) => {
      this.setState(() => ({ tokens: this.props.tokens.filter(token => token.symbol.indexOf(searchTerm) > -1)}) );
    }

    render(){
        return (
            <View>
              <TextInput
                  ref={ref => this.searchBar = ref}
                  onChangeText={this.handleSearch}
                  placeholder={'Find a token ...'}
              />
              <TokenList tokens={this.state.tokens} />
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
  fetchTokens: () => dispatch(fetchTokens())
});


const mapStoretoProps = (state) => {
  console.log(state, 'the state');
  return {
  tokens: state.search.tokens
  }
};

export default connect(mapStoretoProps, mapDispatchToProps)(SearchPage);
