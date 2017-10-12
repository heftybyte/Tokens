
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'mobx-react';
import store from './src/store';

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