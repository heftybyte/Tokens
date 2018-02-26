import React from 'react'
import { Linking, View, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { WebBrowser } from 'expo'
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

const UTM_PARAMS = 'utm_source=tokens.express&utm_medium=mobile_news_feed&utm_campaign=ico'

const visitLink = (link={})=>{
    link.uri && WebBrowser.openBrowserAsync(`${link.uri}?${UTM_PARAMS}`)
      .catch(err => console.error('An error occurred', err))
}

const openExternalApp = (link) => {
    // URIs should be of the form APPNAME://PATH
    link && link.uri && Linking.openURL(link.uri)
    .catch(err => console.error('An error occurred', err))
}

const navigateToPage = (link)=> {
    // URIs should be of the form tokens://ROUTENAME
    if(!link.uri) {
        const err = new Error('Link Uri not supplied');
        console.error('An error occurred', err);
        return;
    }
    const {params} = link;
    const uriParts = link.uri.split('//');
    const routeName = uriParts[1];
    NavigationActions.navigate(routeName, params);
}

const performLinkAction = (link)=> {
    return link.action()
}

const handleLink = (link) => {
    if (link.action) {
        return performLinkAction(link);
    }
    switch(link.target){
        case "web": 
            return visitLink(link);
        case "internal":
            return navigateToPage(link);
        case "app":
            return openExternalApp(link);
    }
}

const Format = (props) => {
    let Layout
    const { format, news, news: { link }, trackFeedItem, bookmarkMap } = props
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

    return (
        <TouchableWithoutFeedback
            onPress={()=>{trackNewsFeedTap(news); trackFeedItem(id, 'tap');handleLink(link)}}
        >
            <View style={{flex:1}}>
                <Layout news={news} bookmarked={!!bookmarkMap[news.id]} onPress={()=>handleLink(link)} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const mapStateToProps = (state) => ({
    bookmarkMap: state.account.bookmarkMap
})

const mapDispatchToProps = (dispatch) => ({
    trackFeedItem: (id, action) => dispatch(_trackFeedItem(id, action))
})

export default connect(mapStateToProps, mapDispatchToProps)(Format);