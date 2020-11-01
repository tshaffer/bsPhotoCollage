import { Store } from 'redux';
import { PhotoCollageAttributes, PhotoCollageState } from '../type';

import { setPhotosRootDirectory } from '../model';
import { readPhotoCollection, updateImageSizes } from './photoCollection';

export function init() {
  console.log('init invoked');
  return ((dispatch: any, getState: any) => {
    console.log('init dispatched');

    dispatch(setPhotosRootDirectory('/Volumes/SHAFFEROTO/mediaItems'));

    dispatch(readPhotoCollection());

    // one time operation to update the manifest with the correct dimensions
    // dispatch(updateImageSizes());
  });
}
