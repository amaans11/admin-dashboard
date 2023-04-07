import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
// import { createBrowserHistory } from "history";
// import { connectRouter, routerMiddleware } from "connected-react-router";

// const history = createBrowserHistory();

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
  return store;
}
