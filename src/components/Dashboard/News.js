import React from 'react';
import { StyleSheet, Text, View, WebView, Image } from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    maxHeight: 250,
  },
  slide: {
    borderTopWidth: 1,
    maxHeight: 250,
    borderTopColor: '#0c0c0c',
    borderBottomColor: '#0c0c0c',
    borderBottomWidth: 1,
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snippet: {
    color: '#fff'
  },
  action: {
    color: "#fff"
  }
});

const News = () => (
  <Swiper style={styles.container} containerStyle={styles.container}>
    <View style={styles.slide}>
      <Text style={styles.snippet}>Upcming ICO</Text>
    </View>
    <View style={styles.slide}>
      <Text style={styles.snippet}>
        Crypto News
      </Text>
      <Text style={styles.action}>
        Visit Link
      </Text>
    </View>
    <View style={styles.slide}>
      <Text style={styles.snippet}>Active ICO</Text>
    </View>
    <View style={styles.slide}>
      <Text style={styles.snippet}>Pre ICO</Text>
    </View>
  </Swiper>
);

export default News;
