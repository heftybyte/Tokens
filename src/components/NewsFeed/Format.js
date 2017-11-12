import React from 'react'
import { Linking, View, TouchableOpacity } from 'react-native';
import ImageLeft from './Layouts/ImageLeftLayout'
import ImageRight from './Layouts/ImageRightLayout'
import ImageDefault from './Layouts/ImageLayout'
import TextCenter from './Layouts/TextCenterLayout'
import TextDefault from './Layouts/TextLayout'
import Video from './Layouts/VideoLayout'
import { trackNewsFeedTap } from '../../helpers/analytics'
import {trackFeedItem} from '../../reducers/account';
import store from '../../store';

const Format = (props) => {
    let Layout
    const { format, news, news: { link } } = props
    const { id } = news;

    switch(format) {
        case "TEXT":
            Layout = TextDefault
            break;
        case "TEXT_CENTER":
            Layout = TextCenter
            break;
        case "VIDEO":
            Layout = Video
            break;
        case "IMAGE":
            Layout = ImageDefault
            break;
        case "IMAGE_LEFT":
            Layout = ImageLeft
            break;
        case "IMAGE_RIGHT":
            Layout = ImageRight
            break;
        default:
            Layout = View
    }

    const visitLink = ()=>{
        link && link.uri && Linking.openURL(link.uri)
          .catch(err => console.error('An error occurred', err))
    }

    return (
        <TouchableOpacity onPress={()=>{trackNewsFeedTap(news); store.dispatch(trackFeedItem(id, 'tap'));visitLink()}} style={{height:130}}>
            <Layout news={news} bookmarked={props.bookmarked} />
        </TouchableOpacity>
    )
}

export default Format;