import React from 'react'
import { Text, View, Image, Linking } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import SaveButton from '../SaveButton'
import { getLinkTextByType } from './helpers'


class ImageRight extends React.Component {

    render() {
        const { news: { title, body, image, link, type } } = this.props

        return (
            <Grid>
                <Row size={20}>
                    <Text style={styles.title}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={70} style={styles.center}>
                    <Col size={65}>
                        <Text style={styles.body}>{body}</Text>
                    </Col>
                    <Col size={35} style={styles.imageRight}>
                        <Image
                            style={{ width: 80, height: 80, borderRadius: 40 }}
                            source={{uri: `${image}`}}
                        />
                    </Col>
                </Row>
                <Row size={10} style={{alignItems: 'flex-end'}}>
                    <Row>
                    <Col size={.8}>
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
                        <Col size={.2}>
                            <SaveButton item={this.props.news}/>
                        </Col>
                    </Row>
                </Row>
            </Grid>
        )
    }
}

export default ImageRight;