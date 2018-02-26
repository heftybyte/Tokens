import React from 'react'
import { Text, View, Image, Linking } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import SaveButton from '../SaveButton'
import { getLinkTextByType } from './helpers'


class ImageRight extends React.Component {

    render() {
        const { news: { title, body, image, link, type, sponsored, imageFormat }, bookmarked, onPress } = this.props
        return (
            <Grid>
                <Row size={20} style={{justifyContent: 'space-between'}}>
                    {/*<SaveButton bookmarked={bookmarked} item={this.props.news} />*/}
                    <Text style={[styles.title]}>{title.toUpperCase()}</Text>
                    {sponsored && 
                        <Text style={[styles.title, { color: '#333' }]}>SPONSORED</Text>}
                </Row>
                <Row size={70} style={styles.center}>
                    <Col size={80}>
                        <Text style={styles.body}>{body}</Text>
                    </Col>
                    <Col size={20} style={[styles.imageRight, { justifyContent: 'center' }]}>
                        <Image
                            style={[styles.image, imageFormat === 'ROUND' ? styles.imageRound : {}]}
                            source={{uri: `${image}`}}
                        />
                    </Col>
                </Row>
                <Row size={20}>
                    <Col size={80}>
                        <Text
                          style={styles.link}
                          onPress={onPress}
                        >
                          { link.text || getLinkTextByType(type) }&gt;
                        </Text>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default ImageRight;