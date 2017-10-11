import React from 'react'
import { Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {styles} from './style'

import Format from './format'


let newsApi = [{title:'Upcoming ICO', format: 'TEXT'}, {title:'Crypto News', format: 'TEXT_CENTER'}, {title:'Visit Link', format: 'VIDEO'},
    {title:'Active ICO', format: 'IMAGE'}, {title:'Pre ICO', format: 'IMAGE_LEFT'}];

const News = () => {
    let newsList = newsApi.map((news,index) => {
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