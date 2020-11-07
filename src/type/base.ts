export interface PhotoCollageState {
  photoCollageAttributes: PhotoCollageAttributes;
  photoCollageSpecs: PhotoCollageSpec[];
  photoCollage: PhotoCollageItem[];
  photoCollection: PhotoCollection;
}

export interface PhotoCollageAttributes {
  photosRootDirectory: string;
}

export interface PhotoCollageSpec {
  width: number;
  height: number;
  photosInCollageSpecs: PhotoInCollageSpec[];
}

export interface PhotoInCollageSpec {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoCollageItem {
  filePath: string;
}

export interface PhotoCollection {
  mediaItemsById: PhotosCollectionLUT;
  albums: any;
  photosInCollection: PhotoInCollection[] | null;
}

export interface PhotosCollectionLUT { [id: string]: PhotoInCollection; }

export interface PhotoInCollection {
  id: string;
  fileName: string;
  height: number;
  width: number | null;
}
