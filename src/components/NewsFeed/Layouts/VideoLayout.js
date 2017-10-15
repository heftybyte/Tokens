import React from 'react'
import { Text, View} from 'react-native';
import {styles} from '../Style'


const Video = (props) => (
    <View>
        <Text style={styles.snippet}>{props.news.title}</Text>
        <Text style={styles.snippet}>{props.news.body}</Text>

    </View>
)

export default Video;