import { 
  PhotoCollageState,
  PhotoCollageAttributes
 } from '../type';

export const getPhotoCollageAttributes = (state: PhotoCollageState): PhotoCollageAttributes => {
  return state.photoCollageAttributes;
};

export const getPhotosRootDirectory = (state: PhotoCollageState): string => {
  return getPhotoCollageAttributes(state).photosRootDirectory;
};
