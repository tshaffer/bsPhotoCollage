import { isNil } from 'lodash';
import * as fs from 'fs-extra';

import {
  PhotoCollageSpec,
  PhotoCollageState,
  PhotoInCollection
} from '../type';
import {
  setPhotoCollageSpec,
  startPhotoPlayback,
  stopPhotoPlayback,
} from '../model';
import {
  getTimeBetweenUpdates,
  getActivePhotoCollageSpec,
  getPhotosRootDirectory,
  getPhotoCollection,
} from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection
} from '../utilities';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getCollagePhoto = (state: PhotoCollageState, landscape: boolean): PhotoInCollection => {

  const photoCollection = getPhotoCollection(state);
  const photosInCollection: PhotoInCollection[] = photoCollection.photosInCollection!;

  const numPhotos = photosInCollection.length;

  while (true) {
    const randomInt = getRandomInt(numPhotos);
    const photoInCollection: PhotoInCollection = photosInCollection[randomInt];
    if (!isNil(photoInCollection.height)) {
      const landscapeOrientation: boolean = photoInCollection.width! >= photoInCollection.height;
      if (landscape === landscapeOrientation) {
        const filePath: string = getFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);
        if (fs.pathExistsSync(filePath)) {
          return photoInCollection;
        }
      }
    }
  }
};

const getCollagePhotos = (state: PhotoCollageState): any[] => {

  const photosInCollage: any[] = [];

  const photoCollageSpec: PhotoCollageSpec | null = getActivePhotoCollageSpec(state);
  if (!isNil(photoCollageSpec)) {
    const { collageWidth, collageHeight, photosInCollageSpecs } = photoCollageSpec;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { x, y, width, height } = photosInCollageSpec;
      const photoInCollection: PhotoInCollection = getCollagePhoto(state, width >= height);
      const filePath: string = getRelativeFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);
      photosInCollage.push(filePath);
    }
  }

  return photosInCollage;
};

const timeoutHandler = (dispatch: any, photoCollageState: PhotoCollageState) => {
  const photosInCollage: any[] = getCollagePhotos(photoCollageState);
  const photosInCollageSpec = photosInCollage.join('|');
  dispatch(setPhotoCollageSpec(photosInCollageSpec));
};

export const startPlayback = () => {
  return ((dispatch: any, getState: any) => {
    dispatch(startPhotoPlayback());
    setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch, getState());
  });
};

export const stopPlayback = () => {
  return ((dispatch: any, getState: any) => {
    dispatch(stopPhotoPlayback());
  });
};
