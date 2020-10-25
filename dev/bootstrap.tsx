import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './bootstrap.css';
import 'normalize.css/normalize.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { BsPhotoCollageState } from '../src/type';
import { bsPhotoCollageReducer } from '../src/model';
import { initPhotoCollage } from '../src//controller';
import {
  BsPhotoCollage,
} from '../src/component';

const getStore = () => {
  console.log('***************************** getStore() invoked');
  const reducers = combineReducers<BsPhotoCollageState>({
    bsPhotoCollage: bsPhotoCollageReducer,
  });
  return createStore<BsPhotoCollageState>(
    reducers,
    composeWithDevTools(
      applyMiddleware(
        thunk,
      ),
    ));
};

const store = getStore();

store.dispatch(initPhotoCollage(store));

ReactDOM.render(
  <Provider store={store}>
    <BsPhotoCollage />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
