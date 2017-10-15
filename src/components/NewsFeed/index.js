import React from 'react'
import { Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'

const News = (props) => {
  const feed = (props.feed || []).map((news,index) => {
        return (
            <View key={index} style={styles.slide}>
                <Format format={news.format} news={news} />
            </View>
        )
      }
  )
  
  return (
      <Swiper
        style={styles.container}
        paginationStyle={{ bottom: -10 }} 
        containerStyle={styles.container}
        dotColor='#333'
        activeDotColor='#fff'>
        {feed}
      </Swiper>
  )
}

export default News;