import React from 'react';
import {WebView} from 'react-native';
import {Video} from 'expo';
const VideoPlayer = ({url, style}) => {
    const {type, id} = parseVideo(url);
    switch(type){
        case 'youtube': 
            return createYoutubePlayer(id, style);
        case 'vimeo':
            return createVimeoPlayer(id, style);
        default:
            return createExpoPlayer(url, style);
    }
};


const parseVideo = (url)  => {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    let type, id = null;

    if (RegExp.$3.indexOf('youtu') > -1) {
        type = 'youtube';
        id = RegExp.$6
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        type = 'vimeo';
        id = RegExp.$6
    }

    return {
        type,
        id
    };
}

const createYoutubePlayer = (videoId, style) => <WebView
    style={style}
    javaScriptEnabled={true}
    source={{uri: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1`}}
/>

const createVimeoPlayer = (videoId, style) => <WebView
    style={style}
    javaScriptEnabled={true}
    source={{uri: `http://player.vimeo.com/video/${videoId}?player_id=player&autoplay=0&title=0&byline=0&portrait=0&api=1&maxheight=${style.height}`}}
/>

const createExpoPlayer = (url, style) => <Video
    source={{ uri: url }}
    rate={1.0}
    volume={1.0}
    muted={false}
    resizeMode="cover"
    shouldPlay={false}
    isLooping
    style={style}
    useNativeControls={true}
/>

export default VideoPlayer;
