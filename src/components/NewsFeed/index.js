import React from 'react'
import { View } from 'react-native'
import Dimensions from 'Dimensions'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'
import { trackNewsFeedSwipe } from '../../helpers/analytics'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
import {saveLatestTimestamp} from '../../reducers/feed'
import { connect } from 'react-redux';
import mock from './MockData'

const window = Dimensions.get('window');

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
      marginBottom: 3
    }}
  />
)

const News = (props) => {
  const { trackFeedItem } = props

  const feed = (props.feed || []).map((news, index) => {
    return (
        <View key={`news-${index}`} style={styles.slide}>
            <Format format={news.format} news={news} />
        </View>
    )
  })
  const paginationLeft = window.width - (125)
  let oldIndex = 0;

  return (
      <Swiper
        loop={false}
        paginationStyle={{
            backgroundColor: "transparent",
            width: '50%',
            bottom: 5,
            left: paginationLeft
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