import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { screenTracking } from '../helpers/analytics';

const store = createStore(
	rootReducer,
	applyMiddleware(
		ReduxThunk,
		screenTracking
	)
);

export default store;