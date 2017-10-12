import React from 'react'
import { Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from './Style'

import Format from './Format'
import mockData from './MockData'



const News = () => {
    let newsList = mockData.map((news,index) => {
            return (
                <View key={index} style={styles.slide}>
                    <Format format={news.format} news={news} />
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