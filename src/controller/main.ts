import { Store } from 'redux';

import { BsPhotoCollageState } from '../type/base';

export function initPhotoCollage(store: Store<BsPhotoCollageState>) {
  console.log('initPhotoCollage invoked');
  return ((dispatch: any) => {
    console.log('initPhotoCollage dispatched');
  });
}
