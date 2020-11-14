import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import * as fs from 'fs-extra';

import { isNil } from 'lodash';

import { photoCollageConfig } from '../config';

import {
  PhotoCollageState,
  PhotoCollageSpec,
  PhotoInCollageSpec,
  PhotoCollection,
  PhotoInCollection,
} from '../type';
import { getActivePhotoCollageSpec, getPhotosRootDirectory } from '../selector';
import { getPhotoCollection } from '../selector';
import { getFilePathFromPhotoInCollection, getOtherFilePathFromPhotoInCollection } from '../utilities';

export interface PhotoCollageComponentState {
  imageCount: number;
}

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface PhotoCollageProps {
  photosRootDirectory: string;
  photoCollection: PhotoCollection;
  photoCollageSpec: PhotoCollageSpec | null;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class PhotoCollageComponent extends React.Component<
  PhotoCollageProps,
  PhotoCollageComponentState
  > {

  canvasRef: any;
  setCanvasRef: any;
  ctx: any;
  photoImages: any[];

  constructor(props: any) {
    super(props);

    this.state = {
      imageCount: 0,
    };

    this.photoImages = [];

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };
  }

  timeoutHandler(photoCollageComponent: any) {
    console.log('timeoutHandler invoked');
    console.log(photoCollageComponent.photoCollageComponent);
    console.log(Object.keys(photoCollageComponent.photoCollageComponent));
    photoCollageComponent.photoCollageComponent.setState({
      imageCount: photoCollageComponent.photoCollageComponent.state.imageCount + 1,
    });

  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(this.canvasRef);
    console.log(this.canvasRef.current);
    console.log(this.ctx);

    this.setState({
      imageCount: 1,
    });

    const timeoutEventCallbackParams: any = {
      photoCollageComponent: this,
    };

    setInterval(this.timeoutHandler, 10000, timeoutEventCallbackParams);
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getPhoto(landscape: boolean): PhotoInCollection {

    const photosInCollection: PhotoInCollection[] = this.props.photoCollection.photosInCollection!;
    const numPhotos = photosInCollection.length;

    while (true) {
      const randomInt = this.getRandomInt(numPhotos);
      const photoInCollection: PhotoInCollection = photosInCollection[randomInt];
      if (!isNil(photoInCollection.height)) {
        const landscapeOrientation: boolean = photoInCollection.width! >= photoInCollection.height;
        if (landscape === landscapeOrientation) {
          const filePath: string = getFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);
          if (fs.pathExistsSync(filePath)) {
            return photoInCollection;
          }
        }
      }
    }
  }

  renderPhoto(filePath: string, x: number, y: number, width: number, height: number) {
    const photo = new Image();
    photo.onload = () => {
      this.scaleToFit(photo, x, y, width, height);
    };
    photo.src = filePath;
  }

  scaleToFit(photo: any, xOnCanvas: number, yOnCanvas: number, widthOnCanvas: number, heightOnCanvas: number) {
    const scale = Math.min(widthOnCanvas / photo.width, heightOnCanvas / photo.height);
    const x = (widthOnCanvas / 2) - (photo.width / 2) * scale;
    const y = (heightOnCanvas / 2) - (photo.height / 2) * scale;
    this.ctx.drawImage(photo, x + xOnCanvas, y + yOnCanvas, photo.width * scale, photo.height * scale);
  }

  getScaledCoordinates(x: number, y: number, width: number, height: number, collageWidth: number, collageHeight: number, screenWidth: number, screenHeight: number): any {
    const screenX = (x / collageWidth) * screenWidth;
    const screenY = (y / collageHeight) * screenHeight;
    return {
      x: screenX,
      y: screenY,
      width: (width / collageWidth) * screenWidth,
      height: (height / collageHeight) * screenHeight,
    };
  }

  renderPhotosInCollage() {
    this.photoImages = [];
    const { collageWidth, collageHeight, photosInCollageSpecs } = this.props.photoCollageSpec!;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { x, y, width, height } = photosInCollageSpec;

      const photoInCollection: PhotoInCollection = this.getPhoto(width >= height);
      console.log('photo: ', photoInCollection);
      console.log(this.props.photoCollection);
      // TEDTODO
      // const filePath: string = getOtherFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);
      const filePath: string = getFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);

      // const filePath = 'mediaItems/E/g/AEEKk93xVAja6f834K9AcVxVQ-1kkcyKU5P5U1k_egj-6JlB3LDtQYiEGcki3kySF0DRWmhLKGiTZX_dUS9s0W9k8kJLFMLlEg.jpg';
      console.log('photo filePath:');
      console.log(filePath);

      
      const screenCoordinates = this.getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageConfig.width, photoCollageConfig.height);
      this.renderPhoto(
        'file:///' + filePath,
        screenCoordinates.x,
        screenCoordinates.y,
        screenCoordinates.width,
        screenCoordinates.height);
    }
  }

  renderPhotoCollage() {
    if (isNil(this.props.photoCollageSpec) ||
      isNil(this.props.photoCollection) ||
      isNil(this.props.photoCollection!.photosInCollection) ||
      this.props.photoCollection.photosInCollection.length === 0) {
      console.log('no photoCollageSpec or no photosInCollection');
      return;
    }
    this.renderPhotosInCollage();
  }

  render() {

    console.log('render');
    console.log(this.canvasRef);
    console.log(this.state.imageCount);

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {
      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

      this.renderPhotoCollage();
    }

    return (
      <div>
        <canvas
          id='flibbet'
          width={photoCollageConfig.width.toString()}
          height={photoCollageConfig.height.toString()}
          ref={this.setCanvasRef}
        />
        pizza
      </div>
    );
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

function mapStateToProps(state: PhotoCollageState): Partial<PhotoCollageProps> {
  return {
    photosRootDirectory: getPhotosRootDirectory(state),
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
  }, dispatch);
};

export const PhotoCollage = connect(mapStateToProps, mapDispatchToProps)(PhotoCollageComponent);
