/**
 * Created by ifeoluwaking on 11/10/2017.
 */

import React from 'react'
import { Text, View} from 'react-native';
import ImageLeft from './layouts/image-left_layout'
import ImageRight from './layouts/image-right_layout'
import Image from './layouts/image_layout'
import TextCenter from './layouts/text-center_layout'
import TextDefault from './layouts/text_layout'
import Video from './layouts/video_layout'



const Format = (props) => {
    let formatted = null;
    switch(props.format) {
        case "TEXT" :
            formatted = <TextDefault />;
            break;
        case "TEXT_CENTER" :
            formatted = <TextCenter />;
            break;
        case "VIDEO" :
            formatted = <Video />;
            break;
        case "IMAGE" :
            formatted = <Image />;
            break;
        case "IMAGE_LEFT" :
            formatted = <ImageLeft />;
            break;
        case "IMAGE_RIGHT" :
            formatted = <ImageRight />;
            break;
        default:
            formatted = <View />;
    }

    return (<View>{formatted}</View>)

}

export default Format;