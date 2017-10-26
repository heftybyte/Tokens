import React from 'react'
import { Linking, Text } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import { getLinkTextByType } from './helpers'


class TextDefault extends React.Component {

    render() {
        const { news: {title, body, link, type } } = this.props
        
        return (
            <Grid>
                <Row size={20}>
                    <Text style={styles.title}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={70}>
                    <Text style={[styles.center, styles.body, styles.textDefault]}>{body}</Text>
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

export default TextDefault;