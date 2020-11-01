import { 
  PhotoCollageState,
  PhotoCollageAttributes,
  PhotoCollection
 } from '../type';

export const getPhotoCollageAttributes = (state: PhotoCollageState): PhotoCollageAttributes => {
  return state.photoCollageAttributes;
};

export const getPhotosRootDirectory = (state: PhotoCollageState): string => {
  return getPhotoCollageAttributes(state).photosRootDirectory;
};

export const getPhotoCollection = (state: PhotoCollageState): PhotoCollection => {
  return state.photoCollection;
};