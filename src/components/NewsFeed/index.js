import React from 'react'
import { Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from './style'

import Format from './format'
import mockData from './mock_data'



const News = () => {
    let newsList = mockData.map((news,index) => {
            return (
                <View key={index} style={styles.slide}>
                    <Text style={styles.snippet}>{news.title}</Text>
                    <Format format={news.format}/>
                </View>
            )
        }
    )
   return (
       <Swiper style={styles.container} containerStyle={styles.container}>
        {newsList}
       </Swiper>
   )
}

export default News;