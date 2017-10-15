import React from 'react'
import { Text, View, Image} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

import {styles} from '../Style'



const ImageRight = (props) => (
    <Col>
        <Row size={25}>
            <Text style={styles.snippet}>{props.news.title}</Text>
        </Row>
        <Row size={75}>
            <Col><Text>{props.news.body}</Text></Col>
            <Col>
                <Image
                    style={{width: 100, height: 100}}
                    source={{uri: `${props.news.image}`}}
                />
            </Col>
        </Row>
    </Col>
)

export default ImageRight;