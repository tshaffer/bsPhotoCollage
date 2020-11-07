import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs-extra';
import * as sizeOf from 'image-size';

import { getPhotoCollection, getPhotosRootDirectory } from '../selector';
import { PhotoCollageState, PhotoCollection, PhotoInCollection } from '../type';
import { setPhotoCollection } from '../model';

export function readPhotoCollection() {
  console.log('readPhotoCollection invoked');

  return ((dispatch: any, getState: any) => {

    console.log('readPhotoCollection dispatched');

    const state: PhotoCollageState = getState();

    const photosRootDirectory = getPhotosRootDirectory(state);

    // const photoCollectionManifestPath: string = isomorphicPath.join(photosRootDirectory, 'photoCollectionManifest.json');
    const photoCollectionManifestPath: string = isomorphicPath.join(photosRootDirectory, 'updatedPhotoCollectionManifest.json');
    const data = fs.readFileSync(photoCollectionManifestPath);
    const photoCollection: PhotoCollection = JSON.parse(data.toString()) as PhotoCollection;
    photoCollection.photosInCollection = [];

    const { mediaItemsById, photosInCollection } = photoCollection;
    for (const mediaItemId in mediaItemsById) {
      if (Object.prototype.hasOwnProperty.call(mediaItemsById, mediaItemId)) {
        const photoInCollection: PhotoInCollection = mediaItemsById[mediaItemId];
        // TEDTODO - check to see if file exists before adding
        photosInCollection.push(photoInCollection);
      }
    }
    console.log(photosInCollection.length);

    dispatch(setPhotoCollection(photoCollection));
  });
}

export function updateImageSizes() {

  console.log('updateImageSizes invoked');

  return ((dispatch: any, getState: any) => {

    console.log('updateImageSizes dispatched');

    const state: PhotoCollageState = getState();

    const photosRootDirectory = getPhotosRootDirectory(state);

    const photoCollection: PhotoCollection = getPhotoCollection(state);
    photoCollection.photosInCollection!.forEach((photoInCollection: PhotoInCollection) => {
      const filePath = getFilePathFromPhotoInCollection(photosRootDirectory, photoInCollection);
      if (fs.pathExistsSync(filePath)) {
        const dimensions = sizeOf(filePath);
        photoInCollection.width = dimensions.width;
        photoInCollection.height = dimensions.height;
      }
    });

    dispatch(setPhotoCollection(photoCollection));

    fsSaveObjectAsLocalJsonFile(photoCollection, '/Users/tedshaffer/Documents/ShafferotoBackup/mediaItems/updatedPhotoCollectionManifest.json');

    console.log('updateImageSizes complete');
  });
}

export function getFilePathFromPhotoInCollection(photosRootDirectory: string, photoInCollection: PhotoInCollection): string {
  const dirPath = isomorphicPath.join(photosRootDirectory, getRelativePathFromHash(photoInCollection.id));
  const filePath = isomorphicPath.join(dirPath, photoInCollection.id + '.jpg');
  return filePath;
}

export function getRelativePathFromHash(hash: string): string {
  return isomorphicPath.join(hash.charAt(hash.length - 2), hash.charAt(hash.length - 1));
}

function fsSaveObjectAsLocalJsonFile(data: object, fullPath: string) {
  const jsonString = JSON.stringify(data, null, 2);
  console.log('invoke fs.writeFileSync');
  console.log(fullPath);
  fs.writeFileSync(fullPath, jsonString);
}
