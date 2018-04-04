import React, { Component } from 'react';
import { ScrollView, Text, View } from "react-native"
import { connect } from 'react-redux';
import { withDrawer } from '../../helpers/drawer'
import { baseAccent, baseColor, brandColor } from '../../config'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Menu } from '../Common/Menu'

class AccountPicker extends Component {

  render() {
    const { navigation, addresses } = this.props
    const { type } =  navigation.state.params

    const items = addresses.map((addr)=>({
      name: `${addr.id.substr(0, 20)}...${addr.id.substr(38,42)}`,
      params: { id: addr.id, type },
      route: 'Account View',
      icon: 'wallet',
      Component: SimpleLineIcons   
    }))

    return (
      <ScrollView style={{flex:1}}>
        <Menu
          navigation={navigation}
          items={items}
          baseColor={baseColor}
          brandColor={brandColor}
          baseAccent={baseAccent}
          style={{flex: 1}}
          listMargin={20}
        />
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}>
          <SimpleLineIcons style={{paddingRight: 10}} name={'plus'} color={brandColor} size={14} />
          <Text style={{ color: brandColor}}>add new {type}</Text>
        </View>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => ({
  addresses: state.account.addresses
})


export default connect(mapStateToProps)(withDrawer(AccountPicker));
