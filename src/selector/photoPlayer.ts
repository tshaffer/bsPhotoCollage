import {
  PhotoCollageState,
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
