import { Amplitude } from 'expo';
import { Analytics, ScreenHit, Event } from 'expo-analytics';
import { NavigationActions } from 'react-navigation';
import { ENVIRONMENT } from 'react-native-dotenv';

if (ENVIRONMENT !== 'development') {
  Amplitude.initialize('2909f6e422ac271d0370e84eef9b74fc')
}

const GA_ID = ENVIRONMENT !== 'development' ? 'UA-104515335-2' : 'dev'
const analytics = new Analytics(GA_ID);

Amplitude.logEvent('AppLoad')
analytics.hit(new ScreenHit('Load'));

export const trackScreenView = (screenName) => {
  Amplitude.logEventWithProperties('ScreenView', { name: screenName })
  analytics.hit(new ScreenHit(screenName))
}

const getFeedItemLabel = (feedItem) =>
  `${feedItem.title} - ${feedItem.body} - ${feedItem.id}`

export const trackNewsFeedSwipe = (feedItem) => {
  const label = getFeedItemLabel(feedItem)
  Amplitude.logEventWithProperties('NewsFeedSwipe', { label })
  analytics.hit(new Event('News Feed', 'Swipe', label))
}

export const trackNewsFeedTap = (feedItem) => {
  const label = getFeedItemLabel(feedItem)
  Amplitude.logEventWithProperties('NewsFeedTap', { label })
  analytics.hit(new Event('News Feed', 'Tap', label))
}

export const trackTap = (label) => {
  Amplitude.logEvent(`Tap${label}`)
  analytics.hit(new Event('UI', 'Button Tap', label))
}

export const trackSearch = (query) => {
  Amplitude.logEvent(`Search${query}`)
  analytics.hit(new Event('Search', 'TokenSearch', query))
}


export const trackAddress = (action, label) => {
  Amplitude.logEvent(`${action}Adddress`)
  analytics.hit(new Event('Address', action, label))
}

export const trackRefresh = (content) => {
  Amplitude.logEvent(`${content}Refresh`)
  analytics.hit(new Event('Refresh', content))
}

const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export const screenTracking = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }
  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);

  if (nextScreen !== currentScreen) {
    trackScreenView(nextScreen);
  }
  return result;
};