import React from 'react'
import { Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {styles} from './style'


let newsApi = [{title:'Upcoming ICO'}, {title:'Crypto News'}, {title:'Visit Link'},
    {title:'Active ICO'}, {title:'Pre ICO'}];

const News = () => {
    let newsList = newsApi.map((news,index) => {
            return (
                <View key={index} style={styles.slide}>
                    <Text style={styles.snippet}>{news.title}</Text>
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