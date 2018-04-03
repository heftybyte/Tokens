import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import md5 from 'crypto-js/md5'
import Identicon from 'identicon.js/identicon'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: 'hidden'
  },
  image: {
    width: 150,
    height: 150
  },
  userMetadata: {
    flexBasis: '50%',
    marginLeft: 'auto'
  },
  username: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },
  userDescription: {
    color: '#fff'
  }
})

const identicon = (str) => {
  const strHash = md5(str).toString();
  const data = new Identicon(strHash, 150).toString()

  return `data:image/png;base64,${data}`;
}

const Profile = ({username}) => (
  <View style={styles.mainContainer}>
    <View style={styles.imageContainer}>
      <Image source={{uri: identicon(username)}} style={styles.image} />
    </View>

      <View style={styles.userMetadata}>
        <Text style={styles.username}>@{username.toLowerCase()}</Text>
        <Text style={styles.userDescription}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Voluptas, eligendi ini
        </Text>
      </View>
  </View>
)

export default Profile