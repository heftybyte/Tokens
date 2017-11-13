import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert, TextInput, Button, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { fetchTokens } from '../../actions/search';
import TokenList from '../TokenList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  input: {
    color: '#fff',
    backgroundColor: '#111',
    flex: .2,
    padding: 10,
    textAlign: 'center',
    fontSize: 20
  },
  list: {
    flex: .9
  }
});

class SearchPage extends Component {
    state = {
      tokens: []
    }

    componentWillMount(){
      // on reopening of this page, the tokens will already be available in props.
      if(this.props.fetched) {
        this.setState({tokens: this.props.tokens}) &&  this.props.fetchTokens();
      } else {
        this.props.fetchTokens();
      }
    }

    componentWillReceiveProps(nextProps){
      nextProps.tokens && this.setState({tokens: nextProps.tokens});
    }

    handleSearch = (searchTerm) => {
      searchTerm = searchTerm.toUpperCase();
      this.setState(() => ({ tokens: this.props.tokens.filter(token => token.symbol.indexOf(searchTerm) > -1)}) );
    }

    render(){
        return (
            <ScrollView
              containerStyleContent={styles.container}
            >
              <TextInput
                  style={styles.input}
                  ref={ref => this.searchBar = ref}
                  onChangeText={this.handleSearch}
                  placeholder={'Enter a token symbol ...'}
                  placeholderTextColor={'#333'}
                  autoCapitalize={'characters'}
              />
              <TokenList style={styles.list} tokens={this.state.tokens} type="search" />
            </ScrollView>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
  fetchTokens: () => dispatch(fetchTokens())
});

const mapStateToProps = (state) => ({
  tokens: state.search.tokens,
  fetched: state.search.fetchedFromStorage,
  portfolio: state.account.portfolio
});

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SearchPage));
