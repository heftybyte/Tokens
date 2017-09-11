import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#0c0c0c',
    borderBottomColor: '#0c0c0c',
    borderBottomWidth: 1,
    backgroundColor: '#000',
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
  <Swiper height={25} style={styles.container}>
    <View style={styles.slide}>
      <Text style={styles.snippet}>
        News
      </Text>
      <Text style={styles.action}>
        Visit Link
      </Text>
    </View>
    <View style={styles.slide}>
      <Text style={styles.snippet}>Beautiful</Text>
    </View>
    <View style={styles.slide}>
      <Text style={styles.snippet}>And simple</Text>
    </View>
  </Swiper>
);

export default News;
