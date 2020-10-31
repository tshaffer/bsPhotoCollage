import { PhotoCollageModelBaseAction } from './baseAction';
import { PhotoCollageAttributes } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PHOTOS_ROOT_DIRECTORY = 'SET_PHOTOS_ROOT_DIRECTORY';

// ------------------------------------
// Actions
// ------------------------------------
export interface SetPhotosRootDirectoryPayload {
  photosRootDirectory: string;
}

export const setPhotosRootDirectory = (
  photosRootDirectory: string,
): PhotoCollageModelBaseAction<SetPhotosRootDirectoryPayload> => {
  return {
    type: SET_PHOTOS_ROOT_DIRECTORY,
    payload: {
      photosRootDirectory,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoCollageAttributes = {
  photosRootDirectory: '',
};

export const photoCollageAttributesReducer = (
  state: PhotoCollageAttributes = initialState,
  action: PhotoCollageModelBaseAction<SetPhotosRootDirectoryPayload>
): PhotoCollageAttributes => {
  switch (action.type) {
    case SET_PHOTOS_ROOT_DIRECTORY: {
      return {
        ...state,
        photosRootDirectory: action.payload.photosRootDirectory,
      };
    }
    default:
      return state;
  }
};

