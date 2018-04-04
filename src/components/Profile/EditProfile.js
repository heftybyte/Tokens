import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer';
import { brandColor } from '../../config'

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
    color: '#fff'
  }
});

class EditProfile extends React.Component {
  state = {
    username: '',
    description: ''
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
         onPress={()=>{console.log('User profile update should happen here')}}
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

export default connect(mapStateToProps)(withDrawer(EditProfile));
