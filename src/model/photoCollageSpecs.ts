import { PhotoCollageModelBaseAction } from './baseAction';
import { PhotoCollageSpec } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PHOTO_COLLAGE_SPECS = 'ADD_PHOTO_COLLAGE_SPECS';

// ------------------------------------
// Actions
// ------------------------------------
type AddPhotosCollageSpecsPayload = PhotoCollageSpec[];

export const addPhotosCollageSpecs = (
  photoCollageSpecs: PhotoCollageSpec[],
): PhotoCollageModelBaseAction<AddPhotosCollageSpecsPayload> => {
  return {
    type: ADD_PHOTO_COLLAGE_SPECS,
    payload: photoCollageSpecs,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoCollageSpec[] = [];

export const photoCollageSpecsReducer = (
  state: PhotoCollageSpec[] = initialState,
  action: PhotoCollageModelBaseAction<AddPhotosCollageSpecsPayload>
): PhotoCollageSpec[] => {
  switch (action.type) {
    case ADD_PHOTO_COLLAGE_SPECS: {
      return action.payload;
    }
    default:
      return state;
  }
};

