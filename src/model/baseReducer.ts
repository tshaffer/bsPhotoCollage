/** @module Model:base */

import {
  Reducer,
  combineReducers
} from 'redux';
import { isNil } from 'lodash';
import { BsPhotoCollageModelState } from '../type';
import {
  BsPhotoCollageModelBaseAction,
} from './baseAction';
import { photosReducer } from './photos';

// -----------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------

// none

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export type BsUiReducer = Reducer<BsPhotoCollageModelState>;

/** @internal */
/** @private */
export const enableBatching = (
  reduce: (state: BsPhotoCollageModelState, action: BsPhotoCollageModelBaseAction ) => BsPhotoCollageModelState,
): BsUiReducer => {
  return function batchingReducer(
    state: BsPhotoCollageModelState,
    action: BsPhotoCollageModelBaseAction,
  ): BsPhotoCollageModelState {
    switch (action.type) {
      default:
        return reduce(state, action);
    }
  };
};

export const bsPhotoCollageReducer = enableBatching(combineReducers<BsPhotoCollageModelState>({
  photos: photosReducer,
}));

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

/** @internal */
/** @private */
// TEDTODO - requires further development
// export function isValidBsPhotoCollageModelState(state: any): boolean {
//   return !isNil(state)
//   && state.hasOwnProperty('arDataFeeds') && isValidDataFeedState(state.arDataFeeds);

// }

/** @internal */
/** @private */
// TEDTODO - requires further development
export function isValidBsPhotoCollageModelStateShallow(state: any): boolean {
  return !isNil(state);
}