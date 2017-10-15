import React from 'react'
import { Text, View} from 'react-native';
import { Col, Row } from "react-native-easy-grid";

import {styles} from '../Style'


const TextCenter = ({ news: { title, body } }) => (
    <Col>
    	<Row size={.2}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
	    </Row>
	    <Row size={.6} style={styles.center}>
	        <Text style={styles.body}>{body}</Text>
	    </Row>
    </Col>
)

export default TextCenter;