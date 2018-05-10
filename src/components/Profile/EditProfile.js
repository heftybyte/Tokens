import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { withDrawer } from '../../helpers/drawer';
import { brandColor } from '../../config';
import { identicon } from '../../helpers/functions';
import { uploadImage as _uploadImage, changeEmail as _changeEmail } from '../../reducers/account';
import { setLoading as _setLoading } from '../../reducers/ui'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15
  },
  imageContainer: {
    flex: .3,
    justifyContent: 'center',
  },
  image: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    borderRadius: 45
  },
  labelText: {
    color: '#fff',
    marginBottom: 15,
    marginTop: 15
  },
  inputWrapper: {
    height: 40,
    width: '100%',
    backgroundColor: "#161616",
  },
  input: {
    borderBottomWidth: 0,
    paddingHorizontal: 5,
    color: '#fff',
    borderRadius: 5,
    height: 40,
    fontSize: 14
  },
  saveBtn: {
    width: '100%',
    height: 40,
    backgroundColor: brandColor,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginVertical: 20
  },
  btnText: {
    color: '#000'
  }
});

const performImageUploadAsync = async (uri, userId, loading, uploadFn) => {
  const imageExtension = uri.split('.').pop()
  const name = `picture-${userId}.${imageExtension}`
  const body = new FormData()

  body.append('profileImage', {
    uri,
    name,
    type: `image/${imageExtension}`
  })

  try {
    loading(true, 'Updating your profile image')
    const res = await uploadFn(userId, body)
    loading(false)
    return res
  } catch (err) {
    console.log(err)
    loading(false)
    Alert.alert(`${err}. Image upload failed. Please try again`)
  }
}

class EditProfile extends React.Component {
  state = {
    email: this.props.email,
    description: this.props.description,
    hasCameraRollPermission: null,
    imageUrl: this.props.profileImage
  }

  pickImage = async () => {
    const { status } = Platform.OS === 'ios' ? await Permissions.askAsync(Permissions.CAMERA_ROLL) : 'granted'
    const { id: userId, setLoading: loading, uploadImage } = this.props

    this.setState({ hasCameraRollPermission: status === 'granted' })

    if (this.state.hasCameraRollPermission) {
      try {
        let res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
          allowsEditing: true,
        })

        if (!res.cancelled) {
          await performImageUploadAsync(res.uri, userId, loading, uploadImage)
          this.setState({ imageUrl: res.uri })
        }
      } catch (err) {
        Alert.alert(`${err}`)
      }
    }
  }

  updateProfile = async () => {
    const { changeEmail, setLoading: loading, id: userId, goToSettingsPage } = this.props
    const { email, description } = this.state

    try {
      loading(true, 'Updating your profile information')
      await changeEmail(userId, email, description)
      loading(false)
      goToSettingsPage();
      Alert.alert("Profile updated")
    } catch(err) {
      Alert.alert(`${err} Profile update failed. Please try again`)
    }

  }

  render() {
    const { imageUrl, email, description } = this.state
    return (
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image source={{uri: imageUrl || identicon(username)}} style={styles.image} />
          <Text
            style={{color: '#fff', textAlign: 'center', marginTop: 20}}
            onPress={this.pickImage}
          >
            Change Photo
          </Text>
        </View>
        <Text style={styles.labelText}>Email:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(email) => this.setState({email})}
            value={email}
          />
        </View>

        <Text style={styles.labelText}>Description:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(description) => this.setState({description})}
            value={description}
            multiline={true}
            numberOfLines={4}
            maxLength={80}
          />
        </View>

        <TouchableOpacity
         onPress={this.updateProfile}
         style={styles.saveBtn}
        >
          <Text style={styles.btnText}>SAVE</Text>
       </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  profileImage: state.account.profileImage,
  id: state.account.id,
  email: state.account.email,
  description: state.account.description,
  portfolio: state.account.portfolio
})

const mapDispatchToProps = (dispatch) => ({
  setLoading: (isLoading, msg) => dispatch(_setLoading(isLoading, msg)),
  uploadImage: (userId, body) => dispatch(_uploadImage(userId, body)),
  changeEmail: (userId, email, desc) => dispatch(_changeEmail(userId, email, desc)),
  goToSettingsPage: () => dispatch(NavigationActions.navigate({ routeName: 'Settings' }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(EditProfile));
