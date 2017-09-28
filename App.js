
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/store/index';

import AppWithNavigationState from './src/navigators/AppNavigator';

class Tokens extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Tokens', () => Tokens);

export default Tokens;