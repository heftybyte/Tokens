import React from 'react'
import { View } from 'react-native';
import ImageLeft from './Layouts/ImageLeftLayout'
import ImageRight from './Layouts/ImageRightLayout'
import ImageDefault from './Layouts/ImageLayout'
import TextCenter from './Layouts/TextCenterLayout'
import TextDefault from './Layouts/TextLayout'
import Video from './Layouts/VideoLayout'
import { Grid } from "react-native-easy-grid";


const Format = (props) => {
    let Layout
    const { format, news } = props

    switch(format) {
        case "TEXT" :
            Layout = TextDefault
            break;
        case "TEXT_CENTER" :
            Layout = TextCenter
            break;
        case "VIDEO" :
            Layout = Video
            break;
        case "IMAGE" :
            Layout = ImageDefault
            break;
        case "IMAGE_LEFT" :
            Layout = ImageLeft
            break;
        case "IMAGE_RIGHT" :
            Layout = ImageRight
            break;
        default:
            Layout = View
    }

    return (
        <Grid>
            <Layout news={news} />
        </Grid>
    )

}

export default Format;