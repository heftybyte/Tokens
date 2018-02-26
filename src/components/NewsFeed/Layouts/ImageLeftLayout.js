import React from 'react'
import { Text, View, Image} from 'react-native';
import { Grid, Row, Col } from "react-native-easy-grid";
import {styles} from '../Style'
import SaveButton from '../SaveButton'
import { getLinkTextByType } from './helpers'


class ImageLeft extends React.Component {

    render() {
        const { news: {title, image, body, type, imageFormat }, bookmarked, onPress } = this.props

        return (
            <Grid>
                <Row size={20}>
                    <Text style={[styles.title, {paddingRight: 10}]}>{title.toUpperCase()}</Text>
                    <SaveButton bookmarked={bookmarked} item={this.props.news}/>
                </Row>
                <Row size={70} style={styles.center}>
                    <Col size={35} style={styles.imageLeft}>
                        <Image
                            style={[styles.image, imageFormat === 'ROUND' ? styles.imageRound : {}]}
                            source={{ uri: image }}
                        />
                    </Col>
                    <Col size={65}>
                        <Text style={styles.body}>{body}</Text>
                    </Col>
                </Row>
                <Row size={10}>
                    <Col size={.8}>
                        <Text
                          style={styles.link}
                          onPress={onPress}>
                          { getLinkTextByType(type) }&gt;
                        </Text>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default ImageLeft;