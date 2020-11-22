import {
  PhotoCollageState, PhotoInCollageSpec,
} from '../type';

export const getPlaybackActive = (state: PhotoCollageState): boolean => {
  return state.photoPlayer.playbackActive;
};

export const getTimeBetweenUpdates = (state: PhotoCollageState): number => {
  return state.photoPlayer.timeBetweenUpdates;
};

export const getPhotoCollageFilesSpec = (state: PhotoCollageState): string => {
  return state.photoPlayer.photoCollageSpec;
};

export const getPhotosInCollage = (state: PhotoCollageState): PhotoInCollageSpec[] => {
  return state.photoPlayer.photosInCollage;
};
