export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface BsPhotoCollageState {
  bsPhotoCollage: BsPhotoCollageModelState;
}

export interface BsPhotoCollageModelState {
  photos: PhotosState;
}

export interface PhotosState {
  fileName: string;
}
