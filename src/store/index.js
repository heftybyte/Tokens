import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers/index';
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;