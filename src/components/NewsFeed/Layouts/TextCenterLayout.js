import React from 'react'
import { Text, View} from 'react-native';
import { Grid, Row } from "react-native-easy-grid";
import SaveButton from '../SaveButton'
import {styles} from '../Style'


class TextCenter extends React.Component {

    render() {
        const { news: { title, body }, bookmarked } = this.props

        return (
            <Grid>
                <Row size={20}>
                    <Text style={[styles.title, {paddingLeft: 10}]}>{title.toUpperCase()}</Text>
                    <SaveButton bookmarked={bookmarked} item={this.props.news}/>
                </Row>
                <Row size={80}>
                    <Text style={[styles.body, styles.textDefault]}>{body}</Text>
                </Row>
            </Grid>
        )
    }
}

export default TextCenter;