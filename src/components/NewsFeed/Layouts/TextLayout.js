/**
 * Created by ifeoluwaking on 11/10/2017.
 */

import React from 'react'
import { Text, View, TouchableHighlight} from 'react-native';
import {styles} from '../Style'



const TextDefault = (props) => (
    <View>
        <Text style={styles.snippet}>{props.news.title}</Text>
        <Text style={styles.snippet}>{props.news.body}</Text>
        <TouchableHighlight><Text style={styles.snippet}>Visit Link</Text></TouchableHighlight>
    </View>
)

export default TextDefault;