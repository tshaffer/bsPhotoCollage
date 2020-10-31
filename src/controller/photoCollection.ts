import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs-extra';

import { getPhotosRootDirectory } from '../selector';
import { PhotoCollageState, PhotoCollection, PhotoInCollection } from '../type';
import { setPhotoCollection } from '../model';

export function readPhotoCollection() {
  console.log('readPhotoCollection invoked');

  return ((dispatch: any, getState: any) => {

    console.log('readPhotoCollection dispatched');

    const state: PhotoCollageState = getState();

    const photosRootDirectory = getPhotosRootDirectory(state);

    const photoCollectionManifestPath: string = isomorphicPath.join(photosRootDirectory, 'photoCollectionManifest.json');
    const data = fs.readFileSync(photoCollectionManifestPath);
    const photoCollection: PhotoCollection = JSON.parse(data.toString()) as PhotoCollection;
    photoCollection.photosInCollection = [];

    const { mediaItemsById, photosInCollection } = photoCollection;
    for (const mediaItemId in mediaItemsById) {
      if (Object.prototype.hasOwnProperty.call(mediaItemsById, mediaItemId)) {
        const photoInCollection: PhotoInCollection = mediaItemsById[mediaItemId];
        photosInCollection.push(photoInCollection);
      }
    }
    console.log(photosInCollection.length);

    dispatch(setPhotoCollection(photoCollection));
  });
}
