import isomorphicPath from 'isomorphic-path';
import { PhotoInCollection } from '../type';

export function getFilePathFromPhotoInCollection(photosRootDirectory: string, photoInCollection: PhotoInCollection): string {
  const dirPath = isomorphicPath.join(photosRootDirectory, getRelativePathFromHash(photoInCollection.id));
  // const dirPath = isomorphicPath.join('/storage/sd/mediaItems', getRelativePathFromHash(photoInCollection.id));
  const filePath = isomorphicPath.join(dirPath, photoInCollection.id + '.jpg');
  return filePath;
}

// TEDTODO
export function getOtherFilePathFromPhotoInCollection(photosRootDirectory: string, photoInCollection: PhotoInCollection): string {
  // const dirPath = isomorphicPath.join(photosRootDirectory, getRelativePathFromHash(photoInCollection.id));
  const dirPath = isomorphicPath.join('mediaItems', getRelativePathFromHash(photoInCollection.id));
  const filePath = isomorphicPath.join(dirPath, photoInCollection.id + '.jpg');
  return filePath;
}

function getRelativePathFromHash(hash: string): string {
  return isomorphicPath.join(hash.charAt(hash.length - 2), hash.charAt(hash.length - 1));
}

