import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import thunkMiddleware from 'redux-thunk';

import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './bootstrap.css';
import 'normalize.css/normalize.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { rootReducer } from '../src/model';

import { PhotoCollageState } from '../src/type';
import { photoCollageReducer } from '../src/model';
import { init } from '../src//controller';
import {
  PhotoCollage,
} from '../src/component';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));


// const getStore = () => {
//   console.log('***************************** getStore() invoked');
//   const reducers = combineReducers<PhotoCollageState>({
//     photoCollage: photoCollageReducer,
//   });
//   return createStore<PhotoCollageState>(
//     reducers,
//     composeWithDevTools(
//       applyMiddleware(
//         thunk,
//       ),
//     ));
// };

// const store = getStore();

// store.dispatch(init(store));
store.dispatch(init());

ReactDOM.render(
  <Provider store={store}>
    <PhotoCollage />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
