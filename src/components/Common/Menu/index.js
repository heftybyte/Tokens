import React, { Component } from 'react';
import { Animated, Image, StatusBar, Text, TouchableWithoutFeedback, View } from "react-native"
import Icon from "@expo/vector-icons/MaterialIcons"
import { SimpleLineIcons } from '@expo/vector-icons';

export const ListItem = (navigation, brandColor, baseAccent, margin, globalOnPress) => ({ name, route, icon, image, Component, color, params, onPress }) => (
  <TouchableWithoutFeedback
      key={name}
      onPress={() =>{
        onPress ? onPress() : navigation.navigate(route, params)
        globalOnPress && globalOnPress()
      }}
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
          {(image || icon || Component) && 
            <View style={{ width: 60 }}>
            {
              Component ? (
                <Component name={icon} size={20} color={color || brandColor} />
              ) : image ? (
                <Image source={image} style={{width: 30, height: 30}} />
              ) : <Icon name={icon} size={20} color={color || brandColor} />
            }
          </View>}
          <View style={{ flex: .9 }}>
              <Text style={{ color: "#fff" }}>{name}</Text>
          </View>
          <View style={{ flex: .1 }}>
              <SimpleLineIcons name={'arrow-right'} color="#fff" size={14} />
          </View>
      </View>
  </TouchableWithoutFeedback>
)

export const Menu = ({ onPress, navigation, items, baseColor, brandColor, baseAccent, showStatusBar, hideBorder, listMargin, style }) => (
  <Animated.View
    style={style || {
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
    {items.map(ListItem(navigation, brandColor, !hideBorder ? baseAccent : null, listMargin, onPress))}
  </Animated.View>
)
