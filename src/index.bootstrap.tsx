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
import { PhotoCollageState } from './type/base';
import { photoCollageReducer } from './model';
import { init } from './controller';
import { PhotoCollage } from './component';

const getStore = () => {
  console.log('***************************** getStore() invoked');
  const reducers = combineReducers<PhotoCollageState>({
    PhotoCollage: photoCollageReducer,
  });
  return createStore<PhotoCollageState>(
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

  store.dispatch(init());

  ReactDOM.render(
    <Provider store={store}>
      <PhotoCollage />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

}

// setTimeout(bootstrapper, 30000);
setTimeout(bootstrapper, 1000);
