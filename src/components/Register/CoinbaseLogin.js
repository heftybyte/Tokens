import React, { Component } from 'react'
import { WebView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { COINBASE_CLIENT_ID as ID, COINBASE_REDIRECT_URI as URI } from '../../config'

const coinbaseConnectUri = 'https://www.coinbase.com/oauth/authorize'
const uri = `${coinbaseConnectUri}?client_id=${ID}&redirect_uri=${encodeURIComponent(URI)}&response_type=code&scope=wallet%3Auser%3Aemail`

const CoinbaseConnect = ({ navigate }) =>
  <WebView
    ref={(ref) => { this.webview = ref; }}
    source={{ uri }}
    style={{marginTop: 30}}
    onNavigationStateChange={(event) => {
      if (event.url.includes('?code=')) {
        let code = event.url.split('?code=').pop()
        this.webview.stopLoading();

        navigate('SignUp', { oauth: true, oauthProvider: 'coinbase', code })
      }
    }}
  />

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(null, mapDispatchToProps)((CoinbaseConnect));