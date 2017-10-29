import React from 'react'
import { Text, View, Image, Dimensions } from 'react-native';
import { Grid, Row } from "react-native-easy-grid";

import {styles} from '../Style'

class ImageDefault extends React.Component {
    state = {}

    componentDidMount() {
        const { news: { image } } = this.props

        Image.getSize(image, (srcWidth, srcHeight) => {
          const maxHeight = Dimensions.get('window').height;
          const maxWidth = Dimensions.get('window').width;

          const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
          this.setState({ width: srcWidth * ratio, height: srcHeight * ratio });
        }, error => {
          console.log('image size error:', error);
        });
    }

    render() {
        const { news: { title, image } } = this.props
        const { width, height } = this.state

        return (
            <Grid>
                <Row>
                    <View style={[styles.center, {backgroundColor: '#fff'}]}>
                        <Image
                            style={{ width, height }}
                            resizeMode="contain"
                            source={{ uri: image }}
                        />
                    </View>
                </Row>
            </Grid>
        )
    }
}

export default ImageDefault;