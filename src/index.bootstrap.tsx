import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './asset/bootstrap.css';
import 'normalize.css/normalize.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { combineReducers } from 'redux';
import { BsPhotoCollageState } from './type/base';
import { bsPhotoCollageReducer } from './model';
import { initPhotoCollage } from './controller';
import { BsPhotoCollage } from './component';

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

function bootstrapper() {

  console.log('bootstrapper');

  // initLogging();

  const store = getStore();

  store.dispatch(initPhotoCollage(store));

  ReactDOM.render(
    <Provider store={store}>
      <BsPhotoCollage />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

}

// setTimeout(bootstrapper, 30000);
setTimeout(bootstrapper, 1000);
