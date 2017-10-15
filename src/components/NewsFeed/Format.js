import React from 'react'
import { Text, View} from 'react-native';
import ImageLeft from './Layouts/ImageLeftLayout'
import ImageRight from './Layouts/ImageRightLayout'
import ImageDefault from './Layouts/ImageLayout'
import TextCenter from './Layouts/TextCenterLayout'
import TextDefault from './Layouts/TextLayout'
import Video from './Layouts/VideoLayout'
import { Grid } from "react-native-easy-grid";




const Format = (props) => {
    let formatted = null;
    switch(props.format) {
        case "TEXT" :
            formatted = <TextDefault news={props.news} />;
            break;
        case "TEXT_CENTER" :
            formatted = <TextCenter news={props.news} />;
            break;
        case "VIDEO" :
            formatted = <Video news={props.news} />;
            break;
        case "IMAGE" :
            formatted = <ImageDefault news={props.news} />;
            break;
        case "IMAGE_LEFT" :
            formatted = <ImageLeft news={props.news} />;
            break;
        case "IMAGE_RIGHT" :
            formatted = <ImageRight news={props.news} />;
            break;
        default:
            formatted = <View />;
    }

    return (<Grid>{formatted}</Grid>)

}

export default Format;