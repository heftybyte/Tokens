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
    position: 'absolute',
    right: 30,
    bottom: 30
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
    images: [ '../../../assets/education/scanning_address.png' ]
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

  render() {
    // const { type, meta } = this.props
    const type = "ADD_ADDRESS"
    const { images } = Content[type]
    console.log(Content[type].images[0])
    const slides = images.map((image, i)=>
      <View style={styles.slide} key={i}>
        <Image
          style={styles.image}
          source={require('../../../assets/education/scanning_address.png')}
        />
      </View>
    )
    // console.log('Education -->', {type, meta})

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
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
    return {
        ...state.ui,
        ...props.navigation.state.params
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      navigate: (routeName, params={}) => dispatch(NavigationActions.navigate({ routeName, params }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Education);
