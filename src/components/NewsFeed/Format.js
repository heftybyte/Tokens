import React from 'react'
import { Linking, View, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import ImageLeft from './Layouts/ImageLeftLayout'
import ImageRight from './Layouts/ImageRightLayout'
import ImageDefault from './Layouts/ImageLayout'
import TextCenter from './Layouts/TextCenterLayout'
import TextDefault from './Layouts/TextLayout'
import Video from './Layouts/VideoLayout'
import { trackNewsFeedTap } from '../../helpers/analytics'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
import { connect } from 'react-redux';
import store from '../../store';

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

    const openExternalApp = () => {
        // URIs should be of the form APPNAME://PATH
        link && link.uri && Linking.openURL(link.uri)
        .catch(err => console.error('An error occurred', err))
    }

    const navigateToPage = ()=> {
        // URIs should be of the form tokens://ROUTENAME
        if(!link.uri) {
            const err = new Error('Link Uri not supplied');
            console.error('An error occurred', err);
            return;
        }
        const {params} = link;
        const uriParts = uri.split('//');
        const routeName = uriParts[1];
        NavigationActions.navigate(routeName, params);
    }

    const handleLink = () => {
        switch(link.target){
            case "web": 
                visitLink();
                break;
            case "internal":
                navigateToPage();
            case "app":
                openExternalApp();
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={()=>{trackNewsFeedTap(news); trackFeedItem(id, 'tap');handleLink()}}
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