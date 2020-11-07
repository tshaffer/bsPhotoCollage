import { Store } from 'redux';
import { PhotoCollageAttributes, PhotoCollageSpec, PhotoCollageState, PhotoInCollageSpec } from '../type';

import { addPhotosCollageSpecs, setPhotosRootDirectory } from '../model';
import { readPhotoCollection, updateImageSizes } from './photoCollection';
import { photoCollageSpecsReducer } from '../../dist/electron';

export function init() {
  console.log('init invoked');
  return ((dispatch: any, getState: any) => {
    console.log('init dispatched');

    dispatch(setPhotosRootDirectory('/Volumes/SHAFFEROTO/mediaItems'));

    dispatch(readPhotoCollection());

    // one time operation to update the manifest with the correct dimensions
    // dispatch(updateImageSizes());

    dispatch(addPhotoCollageSpecs());
  });
}

const addPhotoCollageSpecs = () => {
  return ((dispatch: any, getState: any) => {
    const photoCollageSpec: PhotoCollageSpec = {
      width: 16,
      height: 10,
      photosInCollageSpecs: [
        {
          x: 0,
          y: 0,
          width: 6,
          height: 4,
        },
        {
          x: 6,
          y: 0,
          width: 4,
          height: 6,
        },
        {
          x: 10,
          y: 0,
          width: 6,
          height: 4,
        },
        {
          x: 1,
          y: 4,
          width: 4,
          height: 6,
        },
        {
          x: 5,
          y: 6,
          width: 6,
          height: 4,
        },
        {
          x: 11,
          y: 4,
          width: 4,
          height: 6,
        },
      ],

    };
    dispatch(addPhotosCollageSpecs([photoCollageSpec]));
  });
};
