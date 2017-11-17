import React from 'react'
import { Linking, View, TouchableWithoutFeedback } from 'react-native';
import ImageLeft from './Layouts/ImageLeftLayout'
import ImageRight from './Layouts/ImageRightLayout'
import ImageDefault from './Layouts/ImageLayout'
import TextCenter from './Layouts/TextCenterLayout'
import TextDefault from './Layouts/TextLayout'
import Video from './Layouts/VideoLayout'
import { trackNewsFeedTap } from '../../helpers/analytics'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
import { connect } from 'react-redux';

const Format = (props) => {
    let Layout
    const { format, news, news: { link }, trackFeedItem } = props
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
        link && link.uri && Linking.openURL(link.uri + '?referrer=tokens-express')
          .catch(err => console.error('An error occurred', err))
    }

    return (
        <TouchableWithoutFeedback
            onPress={()=>{trackNewsFeedTap(news); trackFeedItem(id, 'tap');visitLink()}}
        >
            <View style={{flex:1}}>
                <Layout news={news} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    trackFeedItem: (id, action) => dispatch(_trackFeedItem(id, action))
})

export default connect(mapStateToProps, mapDispatchToProps)(Format);