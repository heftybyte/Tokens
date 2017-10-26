import React from 'react'
import { Text, View, Image} from 'react-native';
import { Grid, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import { getLinkTextByType } from './helpers'


class ImageLeft extends React.Component {

    render() {
        const { news: {title, image, body, type } } = this.props

        return (
            <Grid>
                <Row size={20}>
                    <Text style={styles.title}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={70} style={styles.center}>
                    <Col size={35} style={styles.imageLeft}>
                        <Image
                            style={{ width: 80, height: 80, borderRadius: 40 }}
                            source={{ uri: image }}
                        />
                    </Col>
                    <Col size={65}>
                        <Text style={styles.body}>{body}</Text>
                    </Col>
                </Row>
                <Row size={10}>
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
            </Grid>
        )
    }
}

export default ImageLeft;