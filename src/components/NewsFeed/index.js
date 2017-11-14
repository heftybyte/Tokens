import React from 'react'
import { View } from 'react-native'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'
import { trackNewsFeedSwipe } from '../../helpers/analytics'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
import {saveLatestTimestamp} from '../../reducers/feed'
import { connect } from 'react-redux';

const Dot = (color) => (
  <View
    style={{
      backgroundColor: color,
      width: 4, 
      height: 4,
      borderRadius: 2, 
      marginLeft: 3, 
      marginRight: 3, 
      marginTop: 3, 
      marginBottom: 3,
    }}
  />
)

const News = (props) => {
  const { trackFeedItem } = props

  const feed = (props.feed || []).map((news, index) => {
    return (
        <View key={index} style={styles.slide}>
            <Format format={news.format} news={news} />
        </View>
    )
  })

    let oldIndex = 0;

  return (
      <Swiper
        loop={false}
        paginationStyle={{
            backgroundColor: "#0f0f0f",
            bottom: 5,
            borderRadius: 10
        }} 
        dot={Dot('#333')}
        activeDot={Dot('#fff')}
        containerStyle={styles.container}
        onIndexChanged={(index)=>{
          trackNewsFeedSwipe(props.feed[index])
          trackFeedItem(props.feed[index].id, 'view')
            saveLatestTimestamp(props.feed[oldIndex].createdAt)
            oldIndex = index
        }}
       >
        { feed }
      </Swiper>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    trackFeedItem: (id, action) => dispatch(_trackFeedItem(id, action))
})

export default connect(mapStateToProps, mapDispatchToProps)(News);