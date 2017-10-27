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

    componentWillMount(){
      // on reopening of this page, the tokens will already be available in props.
      this.props.tokens.length ? this.setState({tokens: this.props.tokens}) : this.props.fetchTokens();
    }

    componentWillReceiveProps(nextProps){
      nextProps.tokens && this.setState({tokens: nextProps.tokens});
    }

    handleSearch = (searchTerm) => {
      searchTerm = searchTerm.toUpperCase();
      this.setState(() => ({ tokens: this.props.tokens.filter(token => token.symbol.indexOf(searchTerm) > -1)}) );
    }

    // isFirstRender = () => !this.searchBar.value.length && ;

    render(){
        return (
            <View>
              <TextInput
                  ref={ref => this.searchBar = ref}
                  onChangeText={this.handleSearch}
                  placeholder={'Find a token ...'}
              />
              <TokenList tokens={this.state.tokens } />
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
  fetchTokens: () => dispatch(fetchTokens())
});

const mapStoretoProps = (state) => ({
  tokens: state.search.tokens
});

export default connect(mapStoretoProps, mapDispatchToProps)(SearchPage);
