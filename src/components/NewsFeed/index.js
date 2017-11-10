import React from 'react'
import { Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'
import { trackNewsFeedSwipe } from '../../helpers/analytics'
import {trackFeedItem} from '../../reducers/account';
import store from '../../store';

const Dot = (color) => (
  <View
    style={{
      backgroundColor: color,
      width: 4, 
      height: 4,
      borderRadius: 2, 
      marginLeft: 3, 
      marginRight: 3, 
      marginTop: 3, 
      marginBottom: 3,
    }}
  />
)

const News = (props) => {
  const feed = (props.feed || []).map((news, index) => {
    return (
        <View key={index} style={styles.slide}>
            <Format format={news.format} news={news} />
        </View>
    )
  })

  return (
      <Swiper
        loop={false}
        paginationStyle={{
            backgroundColor: "#0f0f0f",
            bottom: 5,
            borderRadius: 10
        }} 
        dot={Dot('#333')}
        activeDot={Dot('#fff')}
        containerStyle={styles.container}
        onIndexChanged={(index)=>{
          trackNewsFeedSwipe(props.feed[index])
          store.dispatch(trackFeedItem(props.feed[index].id, 'view'))
        }}
       >
        { feed }
      </Swiper>
  )
}

export default News;