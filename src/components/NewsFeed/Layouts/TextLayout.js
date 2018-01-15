import React from 'react'
import { Linking, Text } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import {styles} from '../Style'
import SaveButton from '../SaveButton'
import { getLinkTextByType } from './helpers'


class TextDefault extends React.Component {

    render() {
        const { news: {title, body, link, type }, bookmarked } = this.props
        
        return (
            <Grid>
                <Row size={20}>
                    {/*<SaveButton bookmarked={bookmarked} item={this.props.news} />*/}
                    <Text style={[styles.title]}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={60} style={{alignItems: 'center'}}>
                    <Text 
                        style={[styles.center, styles.body, styles.textDefault]}
                        numberOfLines={4}
                    >
                        {body}
                    </Text>
                </Row>
                <Row size={20} style={{alignItems: 'flex-end'}}>
                    <Col size={80}>
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

export default TextDefault;