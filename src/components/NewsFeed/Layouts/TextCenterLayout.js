import React from 'react'
import { Text, View} from 'react-native';
import { Grid, Row } from "react-native-easy-grid";

import {styles} from '../Style'


class TextCenter extends React.Component {

    render() {
        const { news: { title, body } } = this.props

        return (
            <Grid>
                <Row size={20}>
                    <Text style={styles.title}>{title.toUpperCase()}</Text>
                </Row>
                <Row size={60} style={styles.center}>
                    <Text style={styles.body}>{body}</Text>
                </Row>
            </Grid>
        )
    }
}

export default TextCenter;