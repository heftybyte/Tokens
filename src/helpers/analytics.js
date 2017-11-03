import { Analytics, ScreenHit, Event } from 'expo-analytics';
import { NavigationActions } from 'react-navigation';

const analytics = new Analytics('UA-104515335-2');

analytics.hit(new ScreenHit('Load'));

export const trackScreenView = (screenName) => {
	analytics.hit(new ScreenHit(screenName))
}

const getFeedItemLabel = (feedItem) =>
	`${feedItem.title} - ${feedItem.body} - ${feedItem.id}`

export const trackNewsFeedSwipe = (feedItem) => {
	const label = getFeedItemLabel(feedItem)
	analytics.hit(new Event('News Feed', 'Swipe', label))
}

export const trackNewsFeedTap = (feedItem) => {
	const label = getFeedItemLabel(feedItem)
	analytics.hit(new Event('News Feed', 'Tap', label))
}

export const trackTap = (label) => {
	analytics.hit(new Event('UI', 'Button Tap', label))
}

export const trackAddress = (action, label) => {
	analytics.hit(new Event('Address', action, label))
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