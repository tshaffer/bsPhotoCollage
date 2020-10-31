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

import { PhotoCollageState } from '../src/type';
import { photoCollageReducer } from '../src/model';
import { init } from '../src//controller';
import {
  PhotoCollage,
} from '../src/component';

const getStore = () => {
  console.log('***************************** getStore() invoked');
  const reducers = combineReducers<PhotoCollageState>({
    bsPhotoCollage: photoCollageReducer,
  });
  return createStore<PhotoCollageState>(
    reducers,
    composeWithDevTools(
      applyMiddleware(
        thunk,
      ),
    ));
};

const store = getStore();

store.dispatch(init(store));

ReactDOM.render(
  <Provider store={store}>
    <PhotoCollage />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
