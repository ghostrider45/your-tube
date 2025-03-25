import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import Reducers from './Reducers';
import { authMiddleware } from './middleware/authMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    Reducers,
    composeEnhancers(applyMiddleware(thunk, authMiddleware))
);

export default store;