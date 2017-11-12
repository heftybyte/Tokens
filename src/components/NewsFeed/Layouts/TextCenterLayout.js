import React from 'react'
import { Text, View} from 'react-native';
import { Grid, Row } from "react-native-easy-grid";

import {styles} from '../Style'
import  SaveButton from '../SaveButton'


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
                    {!this.props.bookmarked &&
                        <SaveButton item={this.props.news}/>
                    }
                </Row>
            </Grid>
        )
    }
}

export default TextCenter;