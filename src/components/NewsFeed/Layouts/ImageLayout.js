import React from 'react'
import { Text, View, Image} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

import {styles} from '../Style'



const ImageDefault = (props) => (
    <View>
        <Text style={styles.snippet}>{props.news.title}</Text>
            <Col>
        <Image
            style={{width: 50, height: 50}}
            source={{uri: `${props.news.image}`}}
        />
            </Col>
    </View>
)

export default ImageDefault;