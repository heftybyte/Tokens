import React from 'react'
import { Text, View } from 'react-native';
import { styles } from '../Style'
import { Video } from 'expo';

class VideoDefault extends React.Component {

    render() {
        const { news: { link } } = this.props

        return (
            <View>
                <Video
                    flex={1}
                    source={{ uri: link.uri }}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    shouldPlay
                    resizeMode="cover"
                    repeat
                    style={{ height: 250 }}
                />
            </View>
        )
    }
}

export default VideoDefault;