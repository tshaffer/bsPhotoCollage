import { PhotosState } from '../type';

export const photosDefaults: PhotosState = {
  fileName: '',
};
Object.freeze(photosDefaults);

export const photosReducer = (
  state: PhotosState = photosDefaults,
  { type, payload }: (
    any
  ),
): PhotosState => {
  switch (type) {
    default:
      return state;
  }
};
