import { Store } from 'redux';
import { PhotoCollageState } from '../type';

import { setPhotosRootDirectory } from '../model';

export function init(store: Store<PhotoCollageState>) {
  console.log('init invoked');
  return ((dispatch: any) => {
    console.log('init dispatched');

    dispatch(setPhotosRootDirectory('/Volumes/SHAFFEROTO/mediaItems'));
  });
}
