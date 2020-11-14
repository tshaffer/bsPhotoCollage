import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { Provider } from 'react-redux';

import './bootstrap.css';
import 'normalize.css/normalize.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { rootReducer } from '../src/model';
import { readConfig } from '../src/config/config';

import { init } from '../src//controller';
import {
  PhotoCollage,
} from '../src/component';

// this code is run when running on the desktop
console.log('bootstrap.tsx');

readConfig('/Users/tedshaffer/Documents/Projects/bsPhotoCollage/src/config/config.env');

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

store.dispatch(init());

ReactDOM.render(
  <Provider store={store}>
    <PhotoCollage />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
