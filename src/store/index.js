import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { screenTracking } from '../helpers/analytics';
import { navMiddleWare } from '../navigators/AppNavigator'

const store = createStore(
	rootReducer,
	applyMiddleware(
		ReduxThunk,
		navMiddleWare,
		screenTracking
	)
);

export default store;