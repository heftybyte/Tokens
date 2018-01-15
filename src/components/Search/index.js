import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Alert, TextInput, Button, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { fetchTokens } from '../../actions/search';
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

class SearchPage extends Component {
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

    handleSearch = (searchTerm) => {
      searchTerm = searchTerm.toUpperCase();
      this.setState({
        query: searchTerm
      })
    }

    render(){
      const { tokens, query } = this.state
	    const { watchList, watchListMap } = this.props

      return (
        <View style={styles.wrapper}>
          <TextInput
              style={styles.input}
              ref={ref => this.searchBar = ref}
              onChangeText={this.handleSearch}
              placeholder={'Enter a token symbol ...'}
              placeholderTextColor={'#333'}
              autoCapitalize={'characters'}
          />
          <ScrollView
            containerStyleContent={styles.container}
          >
            <TokenList
              style={styles.list}
              tokens={tokens.filter(token=>token.symbol.indexOf(query) > -1)}
              watchList={watchListMap}
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
    watchList: state.account.watchList,
    watchListMap: state.account.watchListMap
});

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(SearchPage));
