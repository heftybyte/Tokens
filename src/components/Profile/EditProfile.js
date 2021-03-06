import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { brandColor } from '../../config'
import { updateProfile } from '../../reducers/account';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15
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

class EditProfile extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    description: ''
  }

  save = () => {
    const { username, password, email, description } = this.state
    this.props.updateProfile({
      username,
      password,
      email,
      description
    })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.labelText}>Username:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
        </View>

        <Text style={styles.labelText}>Password:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            password={true}
          />
        </View>

        <Text style={styles.labelText}>Email:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
        </View>

        <Text style={styles.labelText}>Description:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={(description) => this.setState({description})}
            value={this.state.description}
            multiline={true}
            numberOfLines={4}
            maxLength={80}
          />
        </View>

        <TouchableOpacity
         onPress={()=>this.save()}
         style={styles.saveBtn}
        >
          <Text style={styles.btnText}>SAVE</Text>
       </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.account.portfolio
})

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (profile) => dispatch(updateProfile(profile))
})

export default connect(mapStateToProps, mapDispatchToProps)(withDrawer(EditProfile));
