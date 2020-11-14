import { PhotoCollageConfig } from '../type';

export let photoCollageConfig: PhotoCollageConfig;

// import dotenv from 'dotenv';
// https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam
// If you're importing a third-party module 'foo' that doesn't provide any typings, either in the library itself, or in the @types/foo package (generated from the DefinitelyTyped repository), then you can make this error go away by declaring the module in a file with a .d.ts extension. TypeScript looks for .d.ts files in the same places that it will look for normal .ts files: as specified under "files", "include", and "exclude" in the tsconfig.json.

// // foo.d.ts
// declare module 'foo';
// Then when you import foo it'll just be typed as any.

// Alternatively, if you want to roll your own typings you can do that too:

// // foo.d.ts
// declare module 'foo' {
//     export function getRandomNumber(): number
// } 
// Then this will compile correctly:

// import { getRandomNumber } from 'foo';
// const x = getRandomNumber(); // x is inferred as number
// You don't have to provide full typings for the module, just enough for the bits that you're actually using (and want proper typings for), so it's particularly easy to do if you're using a fairly small amount of API.

// On the other hand, if you don't care about the typings of external libraries and want all libraries without typings to be imported as any, you can add this to a file with a .d.ts extension:

// declare module '*';
// The benefit (and downside) of this is that you can import absolutely anything and TS will compile.

export const readConfig = () => {
  const dotenv = require('dotenv');
  // TEDTODO
  // dotenv.config( { path: '../src/config/config.env' });
  // const dotenv = require('dotenv');
  // // dotenv.config( { path: '../src/config/config.env' });
  // const config = dotenv.config( { path: '/Users/tedshaffer/Documents/Projects/bsPhotoCollage/src/config/config.env' }).parsed;
  // console.log('config: ', config);

  const rawConfig = dotenv.config({ path: '/Users/tedshaffer/Documents/Projects/bsPhotoCollage/src/config/config.env' }).parsed;

  photoCollageConfig = {
    volumeSpec: rawConfig.volumeSpec,
    photosRootDirectory: rawConfig.photosRootDirectory,
    photosManifestFileName: rawConfig.photosManifestFileName,
    width: parseInt(rawConfig.width, 10),
    height: parseInt(rawConfig.height, 10),
  };

  console.log('readConfig, config: ', photoCollageConfig);
};
