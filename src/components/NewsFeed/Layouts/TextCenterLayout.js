/**
 * Created by ifeoluwaking on 11/10/2017.
 */

import React from 'react'
import { Text, View} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

import {styles} from '../Style'


const TextCenter = (props) => (
    <Col style={styles.center}>
        <Text style={styles.snippet}>{props.news.body}</Text>

    </Col>
)

export default TextCenter;