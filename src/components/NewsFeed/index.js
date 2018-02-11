import React from 'react'
import { View } from 'react-native'
import Dimensions from 'Dimensions'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'
import { trackNewsFeedSwipe } from '../../helpers/analytics'
import { trackFeedView } from '../../helpers/api'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
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
  const { trackFeedItem, accountId, feed } = props

  const feedCards = (feed || []).map((news, index) => {
    return (
        <View key={`news-${index}`} style={styles.slide}>
            <Format format={news.format} news={news} />
        </View>
    )
  })
  const paginationLeft = window.width - (125)

  if (feedCards.length) {
    trackFeedView(props.accountId, feed[0].id)
  }

  return feedCards.length && (
      <Swiper
        loop={true}
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
          if (index === feedCards.length-1) {
            this.setState({
              lastCard: true
            })
          }
          trackNewsFeedSwipe(feed[index])
          trackFeedItem(feed[index].id, 'view')
          trackFeedView(accountId, feed[index].id)
        }}
       >
        { feedCards }
      </Swiper>
  ) || null
}

const mapStateToProps = (state) => ({
  accountId: state.account.id
})

const mapDispatchToProps = (dispatch) => ({
    trackFeedItem: (id, action) => dispatch(_trackFeedItem(id, action)),
    trackFeedView: (itemId) => dispatch(_trackFeedView(itemId))
})

export default connect(mapStateToProps, mapDispatchToProps)(News);