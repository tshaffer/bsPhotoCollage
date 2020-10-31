/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { PhotoCollageState } from '../type';
import { photoCollageReducer } from './photoCollage';
import { photoCollageAttributesReducer } from './photoCollageAttributes';
import { photoCollageSpecsReducer } from './photoCollageSpecs';
import { photoCollectionReducer } from './photoCollection';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<PhotoCollageState>({
  photoCollageAttributes: photoCollageAttributesReducer,
  photoCollageSpecs: photoCollageSpecsReducer,
  photoCollage: photoCollageReducer,
  photoCollection: photoCollectionReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------
