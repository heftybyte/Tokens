import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert, TextInput, Button, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { fetchTokens } from '../../actions/search';
import { trackSearch } from '../../helpers/analytics'
import TokenList from '../TokenList';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  input: {
    color: '#fff',
    backgroundColor: '#111',
    height: 50,
    padding: 10,
    textAlign: 'center',
    fontSize: 20
  },
  list: {
    flex: .9
  }
});

class Search extends Component {
    state = {
      tokens: [],
      query: ''
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

    handleSearch = (searchTerm='') => {
      if (searchTerm && searchTerm.length < 3) {
        searchTerm = null
      } else if (searchTerm) {
         trackSearch(searchTerm)
      } 
      this.setState({
        query: searchTerm
      })
    }

    render(){
      const { tokens, query } = this.state
      return (
        <View style={styles.wrapper}>
          <TextInput
              style={styles.input}
              ref={ref => this.searchBar = ref}
              onChangeText={this.handleSearch}
              placeholder={'Search name or symbol...'}
              placeholderTextColor={'#333'}
          />
          <ScrollView
            containerStyleContent={styles.container}
          >
            <TokenList
              style={styles.list}
              tokens={
                tokens.filter(token=>(
                  (token.symbol.search(new RegExp(query, 'i')) > -1) ||
                  (token.name||'').search(new RegExp(query, 'i')) > -1
                ))
              }
              type="search"
            />
          </ScrollView>
        </View>
      );
    }
}

const mapDispatchToProps = (dispatch) => ({
  fetchTokens: () => dispatch(fetchTokens())
});

const mapStateToProps = (state) => ({
    tokens: state.search.tokens,
    fetched: state.search.fetchedFromStorage,
    portfolio: state.account.portfolio,
});

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Search));
