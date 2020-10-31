import { Store } from 'redux';
import { PhotoCollageState } from '../type';

export function init(store: Store<PhotoCollageState>) {
  console.log('init invoked');
  return ((dispatch: any) => {
    console.log('init dispatched');

    // set filePath of directory that is the root of the photo's
  });
}
