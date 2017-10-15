import React from 'react'
import { Linking, Text } from 'react-native';
import { Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import { getLinkTextByType } from './helpers'


const TextDefault = ({ news: {title, body, link, type } }) => (
    <Col>
      <Row size={.2}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </Row>
      <Row size={.7}>
        <Text style={[styles.center, styles.body, styles.textDefault]}>{body}</Text>
      </Row>
      <Row size={.1}>
        <Text
          style={styles.link}
          onPress={()=>{
            link && Linking.openURL(link.uri)
              .catch(err => console.error('An error occurred', err));
          }}
        >
          { getLinkTextByType(type) }&gt;
        </Text>
      </Row>
    </Col>
)

export default TextDefault;