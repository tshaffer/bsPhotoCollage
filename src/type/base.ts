export interface PhotoCollageState {
  photosCollageAttributes: PhotoCollageAttributes;
  photoCollageSpecs: PhotoCollageSpec[];
  photoCollage: PhotoCollageItem[];
}

export interface PhotoCollageAttributes {
  photosRootDirectory: string;
}

export interface PhotoCollageSpec {
  photoInCollageSpecs: PhotoInCollageSpec[];
}

export interface PhotoInCollageSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  landscapeOrientation: boolean;
}

export interface PhotoCollageItem {
  filePath: string;
}
