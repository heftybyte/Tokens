import React, { Component } from 'react'
import { WebView, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

class CoinbaseConnect extends Component {
  render () {
    const uri = 'https://www.coinbase.com/oauth/authorize?client_id=030e132992e00eb796fcbf4eb1de09860ebd4fd865d462ff78265497dfef4842&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=wallet%3Auser%3Aemail'
    const { navigate, navigation } = this.props
    const { showWebview } = navigation.state.params

    console.log(showWebview, "coinbase connect thingy")
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        style={{marginTop: 30}}
        onNavigationStateChange={(event) => {
          if (event.url.includes('?code=')) {
            let code = event.url.split('?code=').pop()
            console.log(code, true);
            this.webview.stopLoading();
            navigate('SignUp', { oauth: true, oauthProvider: 'coinbase' })
          }
        }}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(null, mapDispatchToProps)((CoinbaseConnect));