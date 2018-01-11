import React from 'react'
import { Text, View, Image, Linking } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import SaveButton from '../SaveButton'
import { getLinkTextByType } from './helpers'


class ImageRight extends React.Component {

    render() {
        const { news: { title, body, image, link, type }, bookmarked } = this.props
        return (
            <Grid>
                <Row size={20}>
                    {/*<SaveButton bookmarked={bookmarked} item={this.props.news} />*/}
                    <Text style={[styles.title]}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={70} style={styles.center}>
                    <Col size={80}>
                        <Text style={styles.body}>{body}</Text>
                    </Col>
                    <Col size={20} style={[styles.imageRight, { justifyContent: 'center' }]}>
                        <Image
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            source={{uri: `${image}`}}
                        />
                    </Col>
                </Row>
                <Row size={10}>
                    <Col size={.75}>
                        <Text
                          style={styles.link}
                          onPress={()=>{
                            link && Linking.openURL(link.uri)
                              .catch(err => console.error('An error occurred', err));
                          }}
                        >
                          { getLinkTextByType(type) }&gt;
                        </Text>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default ImageRight;