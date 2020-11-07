import { PhotoCollageModelBaseAction } from './baseAction';
import { PhotoCollageAttributes } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PHOTOS_ROOT_DIRECTORY = 'SET_PHOTOS_ROOT_DIRECTORY';
export const SET_PHOTO_COLLAGE_SPEC_INDEX = 'SET_PHOTO_COLLAGE_SPEC_INDEX';

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

export interface SetPhotoCollageSpecIndexPayload {
  photoCollageSpecIndex: number;
}

export const setPhotoCollageSpecIndex = (
  photoCollageSpecIndex: number,
): PhotoCollageModelBaseAction<SetPhotoCollageSpecIndexPayload> => {
  return {
    type: SET_PHOTO_COLLAGE_SPEC_INDEX,
    payload: {
      photoCollageSpecIndex,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoCollageAttributes = {
  photosRootDirectory: '',
  photoCollageSpecIndex: -1,
};

export const photoCollageAttributesReducer = (
  state: PhotoCollageAttributes = initialState,
  action: PhotoCollageModelBaseAction<SetPhotosRootDirectoryPayload & SetPhotoCollageSpecIndexPayload>
): PhotoCollageAttributes => {
  switch (action.type) {
    case SET_PHOTOS_ROOT_DIRECTORY: {
      return {
        ...state,
        photosRootDirectory: action.payload.photosRootDirectory,
      };
    }
    case SET_PHOTO_COLLAGE_SPEC_INDEX: {
      return {
        ...state,
        photoCollageSpecIndex: action.payload.photoCollageSpecIndex,
      };
    }
    default:
      return state;
  }
};

