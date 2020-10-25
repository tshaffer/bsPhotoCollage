/** @module Model:base */

import {
  Action,
  Dispatch,
  ActionCreator,
} from 'redux';
import { BsPhotoCollageModelState, BsPhotoCollageState } from '../type';

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface BsPhotoCollageModelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
  error?: boolean;
  meta?: {};
}

/** @internal */
/** @private */
export interface BsPhotoCollageModelAction<T> extends BsPhotoCollageModelBaseAction {
  payload: T;     // override payload with specific parameter type
}

/** @internal */
/** @private */
export type BsPhotoCollageModelActionCreator<T> = ActionCreator<BsPhotoCollageModelAction<T>>;
export type BsPhotoCollageModelThunkAction<T> = (
  dispatch: BsPhotoCollageDispatch,
  getState: () => BsPhotoCollageModelState,
  extraArgument: undefined,
) => T;

export interface BsPhotoCollageBaseAction extends Action {
  type: string;
  payload: {} | null;
  error?: boolean;
  meta?: {};
}

export interface BsPhotoCollageAction<T> extends BsPhotoCollageBaseAction {
  payload: T;
}

export type BsPhotoCollageDispatch = Dispatch<BsPhotoCollageState>;
export type BsPhotoCollageVoidThunkAction = any;
// (dispatch: BsPhotoCollageDispatch, getState: () => BaApUiState, extraArgument: undefined) => void;
export type BsPhotoCollageStringThunkAction = any;
// (dispatch: BsPhotoCollageDispatch, getState: () => BaApUiState, extraArgument: undefined) => string;
export type BsPhotoCollageVoidPromiseThunkAction = any;
// (dispatch: BsPhotoCollageDispatch, getState: () => BaApUiState, extraArgument: undefined) => Promise<void>;
export type BsPhotoCollageThunkAction<T> = any;
// (dispatch: BsPhotoCollageDispatch, getState: () => BaApUiState, extraArgument: undefined) => BsPhotoCollageAction<T>;
export type BsPhotoCollageAnyPromiseThunkAction = any;
// (dispatch: BsPhotoCollageDispatch, getState: () => BaApUiState, extraArgument: undefined) => Promise<any>;

export type BsPhotoCollageActionCreator<T> = ActionCreator<BsPhotoCollageAction<T>>;

export interface BsPhotoCollageModelBatchAction extends Action {
  type: string;
  payload: BsPhotoCollageBaseAction[];
}
