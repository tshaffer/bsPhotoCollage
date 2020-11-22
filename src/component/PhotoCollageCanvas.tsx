import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import * as fs from 'fs-extra';

import { isNil } from 'lodash';

import { photoCollageConfig } from '../config';

import {
  PhotoCollageState,
  PhotoCollageSpec,
  PhotoCollection,
  PhotoInCollection,
  DisplayedPhoto,
} from '../type';
import { startPlayback } from '../controller';

import { getActivePhotoCollageSpec, getPhotoCollageFilesSpec, getPhotosRootDirectory } from '../selector';
import { getPhotoCollection } from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection,
} from '../utilities';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface PhotoCollageCanvasPropsFromParent {
  onSelectPhoto: any;
}

/** @internal */
/** @private */
export interface PhotoCollageCanvasComponentState {
  imageCount: number;
  selectedPhoto: DisplayedPhoto | null;
}

/** @internal */
/** @private */
export interface PhotoCollageCanvasProps extends PhotoCollageCanvasPropsFromParent {
  photosRootDirectory: string;
  photoCollection: PhotoCollection;
  photoCollageSpec: PhotoCollageSpec | null;
  photoCollageFilesSpec: string;
  onStartPlayback: () => any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class PhotoCollageCanvasComponent extends React.Component<
  PhotoCollageCanvasProps,
  PhotoCollageCanvasComponentState
  > {

  canvasRef: any;
  setCanvasRef: any;
  ctx: any;
  photoImages: DisplayedPhoto[];
  intervalId: any;

  constructor(props: any) {
    super(props);

    console.log('constructor');
    console.log(props);

    this.state = {
      imageCount: 0,
      selectedPhoto: null,
    };

    this.photoImages = [];
    this.intervalId = -1;

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    // console.log(this.canvasRef);
    // console.log(this.canvasRef.current);
    // console.log(this.ctx);

    this.setState({
      imageCount: 1,
    });

    this.startTimer();

    this.props.onStartPlayback();
  }

  shouldComponentUpdate(nextProps: PhotoCollageCanvasProps, nextState: PhotoCollageCanvasComponentState): boolean {
    // if (this.state.imageCount !== nextState.imageCount) {
    //   return true;
    // }
    // return false;
    return true;
  }

  startTimer(): void {
    const timeoutEventCallbackParams: any = {
      photoCollageComponent: this,
    };

    this.intervalId = setInterval(this.handleTimeout, 10000, timeoutEventCallbackParams);
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

  handleTimeout(photoCollageComponent: any) {
    console.log('timeoutHandler invoked');
    console.log(photoCollageComponent.photoCollageComponent);
    console.log(Object.keys(photoCollageComponent.photoCollageComponent));
    photoCollageComponent.photoCollageComponent.setState({
      imageCount: photoCollageComponent.photoCollageComponent.state.imageCount + 1,
    });
  }

  handleClick(e: any) {

    const elem = this.canvasRef;
    const elemLeft = elem.offsetLeft + elem.clientLeft;
    const elemTop = elem.offsetTop + elem.clientTop;

    const x = e.pageX - elemLeft;
    const y = e.pageY - elemTop;

    // Get selected photo
    let index = 0;
    for (const photoImage of this.photoImages) {
      if (y > photoImage.y && y < photoImage.y + photoImage.height
        && x > photoImage.x && x < photoImage.x + photoImage.width) {
        console.log('clicked photo with index');
        console.log(index);

        clearInterval(this.intervalId);
        this.intervalId = -1;

        this.props.onSelectPhoto(photoImage);

        return;
      }
      index++;
    }

    this.setState({
      selectedPhoto: null,
    });
  }

  renderPhotosInCollage() {

    const photoCollageFilesSpec: string = this.props.photoCollageFilesSpec;
    const photoCollageFilesSpecs: string[] = photoCollageFilesSpec.split('|');

    this.photoImages = [];
    const { collageWidth, collageHeight, photosInCollageSpecs } = this.props.photoCollageSpec!;
    let index = 0;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { x, y, width, height } = photosInCollageSpec;

      const filePath = photoCollageFilesSpecs[index++];

      const screenCoordinates = this.getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageConfig.width, photoCollageConfig.height);

      this.photoImages.push({
        x: screenCoordinates.x,
        y: screenCoordinates.y,
        width: screenCoordinates.width,
        height: screenCoordinates.height,
        // photoInCollection,
      });

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

    if (isNil(this.props.photoCollageFilesSpec) || this.props.photoCollageFilesSpec.length === 0) {
      return null;
    }

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {
      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

      this.renderPhotoCollage();
    }

    return (
      <div>
        <canvas
          id='collageCanvas'
          width={photoCollageConfig.width.toString()}
          height={photoCollageConfig.height.toString()}
          ref={this.setCanvasRef}
          onClick={this.handleClick}
        />
        pizza
      </div>
    );
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

function mapStateToProps(state: PhotoCollageState, ownProps: PhotoCollageCanvasPropsFromParent): Partial<PhotoCollageCanvasProps> {
  return {
    photosRootDirectory: getPhotosRootDirectory(state),
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
    photoCollageFilesSpec: getPhotoCollageFilesSpec(state),
    onSelectPhoto: ownProps.onSelectPhoto,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    onStartPlayback: startPlayback,
  }, dispatch);
};

export const PhotoCollageCanvas = connect(mapStateToProps, mapDispatchToProps)(PhotoCollageCanvasComponent);
