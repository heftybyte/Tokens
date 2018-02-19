import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Text } from 'native-base';
import Swiper from 'react-native-swiper'

import { registerForPushNotificationsAsync } from '../../helpers/functions'
import { withDrawer } from '../../helpers/drawer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  text:{
      color: '#fff',
  },
  centerText: {
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#6b2fe2',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttonText: {
    color: '#fff'
  },
  slide: {

  },
  image: {
    width: '100%'
  }
});

const Content = {
  "ADD_ADDRESS": {
    images: [ require('../../../assets/education/scanning_address.png') ]
  }
}

const Dot = (color) => (
  <View
    style={{
      backgroundColor: color,
      width: 4,
      height: 4,
      borderRadius: 2,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3
    }}
  />
)

class Education extends Component {

  messageFor(pushEnabled) {
    const intro = "We're scanning the blockchain for your tokens."
    const pushEnabledMsg = `${intro} You'll receive a push notification when its complete.`
    const pushDisabledMsg = `${intro} Enable push notifications to be notified when its completes.`

    return pushEnabled ? pushEnabledMsg : pushDisabledMsg
  }

  render() {
    const { type, meta } = this.props
    const { images } = Content[type]
    const { pushEnabled } = meta
    const message = this.messageFor(pushEnabled)
    const slides = images.map((image, i)=>
      <View style={styles.slide} key={i}>
        <Image
          style={styles.image}
          source={image}
        />
      </View>
    )

    return (
      <View
        style={styles.container}
      >
        <Swiper
          loop={false}
          paginationStyle={{
              backgroundColor: "transparent"
          }}
          dot={Dot('#333')}
          activeDot={Dot('#fff')}
          containerStyle={styles.container}
         >
          { slides }
        </Swiper>

        <View style={styles.container}>
          <Text style={styles.title}>
            {message}
          </Text>

          {!pushEnabled && <Button
              style={styles.button}
              onPress={registerForPushNotificationsAsync}
              >
            <Text>Enable Push Notifications</Text>
          </Button>}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
    return {
        ...state.ui,
        ...props.navigation.state.params,
        portfolio: state.account.portfolio,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(Education));
