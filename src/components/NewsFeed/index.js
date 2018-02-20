import React from 'react'
import { Animated, View } from 'react-native'
import Dimensions from 'Dimensions'
import Swiper from 'react-native-swiper'
import {styles} from './Style'
import Format from './Format'
import { trackNewsFeedSwipe } from '../../helpers/analytics'
import { trackFeedView } from '../../helpers/api'
import { trackFeedItem as _trackFeedItem } from '../../reducers/account';
import { connect } from 'react-redux';
import { fetchFeed } from '../../reducers/feed'

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

const CARD_HEIGHT = 130

class News extends React.Component {
  state = {
    heightAnim: new Animated.Value(CARD_HEIGHT),
    endCard: {
      format: 'IMAGE_RIGHT',
      image: 'https://www.shareicon.net/data/128x128/2017/02/24/879486_green_512x512.png',
      title: 'Complete',
      body: 'All caught up! New cards will appear as they come.',
      link: {
        type: 'close',
        text: 'CLOSE'
      }
    }
  }

  componentDidMount() {
    this.setState({
      endCard: {
        ...this.state.endCard,
        link: {
          ...this.state.endCard.link,
          action: () => {
            this.close()
          }
        }
      }
    })
  }

  open = () => {
    Animated.timing(
      this.state.heightAnim,
      {
        toValue: CARD_HEIGHT,
        duration: 300
      }
    ).start()
  }

  close = () => {
    Animated.timing(
      this.state.heightAnim,
      {
        toValue: 0,
        duration: 300
      }
    ).start()
  }

  render() {
    let { trackFeedItem, accountId, feed } = this.props
      feed = [...feed]
    if (feed && feed.length === 1) {
      feed.push(this.state.endCard)
    }

    const feedCards = (feed || []).map((news, index) => {
      return (
          <View key={`news-${index}`} style={styles.slide}>
              <Format format={news.format} news={news} />
          </View>
      )
    })
    const paginationLeft = window.width - (125)

    if (feedCards.length) {
      feed[0].id && trackFeedView(accountId, feed[0].id)
    }
    return feedCards.length && (
      <Animated.View style={{height: this.state.heightAnim }}>
        <Swiper
          loop={false}
          index={0}
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
            const feedItem = feed[index]
            if (!feedItem || !feedItem.id) {
              return
            }
            trackNewsFeedSwipe(feedItem)
            trackFeedItem(feedItem.id, 'view')
            trackFeedView(accountId, feedItem.id)
          }}
         >
          { feedCards }
        </Swiper>
      </Animated.View>
  ) || null
  }
}

const mapStateToProps = (state) => ({
  accountId: state.account.id
})

const mapDispatchToProps = (dispatch) => ({
    trackFeedItem: (id, action) => dispatch(_trackFeedItem(id, action)),
    trackFeedView: (itemId) => dispatch(_trackFeedView(itemId)),
    fetchFeed: () => dispatch(fetchFeed())
})

export default connect(mapStateToProps, mapDispatchToProps)(News);