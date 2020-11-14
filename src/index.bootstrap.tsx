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
import { photoCollageAttributesReducer, photoCollageReducer, photoCollageSpecsReducer, photoCollectionReducer } from './model';
import { init } from './controller';
import { PhotoCollage } from './component';
import { readConfig } from './config';

const getStore = () => {
  const reducers = combineReducers<PhotoCollageState>({
    photoCollageAttributes: photoCollageAttributesReducer,
    photoCollageSpecs: photoCollageSpecsReducer,
    photoCollage: photoCollageReducer,
    photoCollection: photoCollectionReducer,

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

  console.log('index.bootstrap.tsx');

  readConfig('/storage/sd/config.env');

  console.log(`Current directory: ${process.cwd()}`);

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
