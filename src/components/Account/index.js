import React from 'react';
import { StyleSheet, Text, TextInput, ScrollView, View, Button } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#000'
  },
  accountLabel: {
    color: '#fff'
  },
  accountInput: {
    backgroundColor: '#fff'
  }
});

const Account = () => (
  <ScrollView style={styles.scrollContainer} containerStyleContent={styles.container}>
    <Text style={styles.accountLabel}>Account:</Text><TextInput style={styles.accountInput}/>
  </ScrollView>
);

Account.navigationOptions = ({ navigation }) => ({
  title: 'Accounts',
  headerStyle: styles.header,
  headerRight: <Ionicons style={{paddingRight:20}} name="ios-search-outline" size={28} color="white" />
})

export default Account;
