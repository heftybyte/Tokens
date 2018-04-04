import React, { Component } from 'react';
import { Image, StatusBar, Text, TouchableHighlight, View } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { SimpleLineIcons } from '@expo/vector-icons';

export const ListItem = (navigation, brandColor, baseAccent, margin) => ({ name, route, icon, image, Component, color, params }) => (
  <TouchableHighlight
      key={name}
      onPress={() => navigation.navigate(route, params)}
  >
      <View
          style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginHorizontal: margin,
              alignItems: "center",
              paddingLeft: 25,
              height: 75,
              borderBottomWidth: baseAccent ? 1 : 0,
              borderColor: baseAccent
          }}
      >
          <View style={{ width: 60 }}>
            {
              Component ? (
                <Component name={icon} size={20} color={color || brandColor} />
              ) : image ? (
                <Image source={image} style={{width: 30, height: 30}} />
              ) : <Icon name={icon} size={20} color={color || brandColor} />
            }
          </View>
          <View style={{ flex: .9 }}>
              <Text style={{ color: "#fff" }}>{name}</Text>
          </View>
          <View style={{ flex: .1 }}>
              <SimpleLineIcons name={'arrow-right'} color="#fff" size={14} />
          </View>
      </View>
  </TouchableHighlight>
)

export const Menu = ({ navigation, items, baseColor, brandColor, baseAccent, showStatusBar, hideBorder, listMargin, style }) => (
  <View style={style || {
      flex: 1,
      backgroundColor: baseColor,
      paddingTop: 40,
      shadowColor: '#000',
      shadowOpacity: 0.8,
      shadowOffset: {width: 2, height: 1},
      shadowRadius: 20
  }}>
    {showStatusBar &&
      <View>
        <StatusBar barStyle="light-content" />
        <View style={{ borderBottomWidth: 2, borderColor: baseAccent, alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Menu</Text>
        </View>
      </View>
    }
    {items.map(ListItem(navigation, brandColor, !hideBorder ? baseAccent : null, listMargin))}
  </View>
)
