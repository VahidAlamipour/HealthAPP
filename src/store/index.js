import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  // ...options
});

let middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

/*const reduxLogDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = process.env.NODE_ENV === 'development' ? 
  createStore(
    reducers,
    reduxLogDevTools,
    applyMiddleware(...middlewares)
  ) :
  createStore(
    reducers,
    applyMiddleware(...middlewares)
  );*/
  
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = process.env.NODE_ENV === 'development' ? 
  createStore(
    reducers,
    composeEnhancer(applyMiddleware(...middlewares))
  ) :
  createStore(
    reducers,
    applyMiddleware(...middlewares)
  );


export default store;
