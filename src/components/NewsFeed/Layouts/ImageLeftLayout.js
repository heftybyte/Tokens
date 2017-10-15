import React from 'react'
import { Text, View, Image} from 'react-native';
import { Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import { getLinkTextByType } from './helpers'


const ImageLeft = ({ news: {title, image, body, type } }) => (
    <Col>
        <Col>
            <Row size={.2}>
                <Text style={styles.title}>{title.toUpperCase()}</Text>
            </Row>
            <Row size={.7} style={styles.center}>
                <Col size={.35} style={styles.imageLeft}>
                    <Image
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                        source={{ uri: image }}
                    />
                </Col>
                <Col size={.65}>
                    <Text style={styles.body}>{body}</Text>
                </Col>
            </Row>
        </Col>
        <Row size={.1}>
            <Row>
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
        </Row>
    </Col>
)

export default ImageLeft;