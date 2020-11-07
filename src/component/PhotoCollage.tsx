import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { isNil } from 'lodash';

import {
  PhotoCollageState,
  PhotoCollageSpec,
  PhotoInCollageSpec,
  PhotoCollection,
  PhotoInCollection,
} from '../type';
import { getActivePhotoCollageSpec, getPhotosRootDirectory } from '../selector';
import { getPhotoCollection } from '../selector';
import { getFilePathFromPhotoInCollection } from '../utilities';

export interface PhotoCollageComponentState {
  note: string;
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
      note: 'noNote',
    };

    this.photoImages = [];

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(this.canvasRef);
    console.log(this.canvasRef.current);
    console.log(this.ctx);

    this.setState({
      note: 'mounted',
    });
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
      const landscapeOrientation: boolean = photoInCollection.width! >= photoInCollection.height;
      if (landscape === landscapeOrientation) {
        return photoInCollection;
      }
    }
  }

  renderPhoto(filePath: string, x: number, y: number) {
    // const index = this.photoImages.length;
    // this.photoImages.push(new Image());
    // this.photoImages[index].onload = () => {
    //   this.ctx.drawImage(this.photoImages[index], x, y);
    // };
    // this.photoImages[index].src = filePath;

    const photo = new Image();
    photo.onload = () => {
      this.ctx.drawImage(photo, x, y);
    };
    photo.src = filePath;
  }

  getScaledCoordinates(x: number, y: number, collageWidth: number, collageHeight: number, screenWidth: number, screenHeight: number): any {
    const screenX = (x / collageWidth) * screenWidth;
    const screenY = (y / collageHeight) * screenHeight;
    return {
      x: screenX,
      y: screenY,
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
      const filePath: string = getFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);
      const screenCoordinates = this.getScaledCoordinates(x, y, collageWidth, collageHeight, 1920, 1080);
      this.renderPhoto('file:///' + filePath, screenCoordinates.x, screenCoordinates.y);
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


    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {
      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

      this.renderPhotoCollage();

      // this.renderPhoto('nature.jpg', 0, 0);
      // this.renderPhoto('lion.png', 551, 0);
      // this.renderPhoto('/Volumes/SHAFFEROTO/mediaItems/M/Q/AEEKk9308hS9rwQqpcWwZzJcrluxRoe0-XK4GJ0cvJvSFjutArriKgjc6ryNGbNQD_g7o5QSXOAWp0nQPmFUsmjLqND1kTNdMQ.jpg', 0, 0);
      // this.renderPhoto('AEEKk90lblixn0pzflfyRgmLCVu36qCGJ2zpUSdXH47Xe5GD0sGAvW0.jpg', 0, 0);
      // this.renderPhoto('file:////Volumes/SHAFFEROTO/mediaItems/W/0/AEEKk90lblixn0pzflfyRgmLCVu36qCGJ2zpUSdXH47Xe5GD0sGAvW0.jpg', 0, 0);
    }

    // 551x310
    // 420x420
    return (
      <div>
        <canvas
          id='flibbet'
          width='1920'
          height='1080'
          ref={this.setCanvasRef}
        />
        pizza
        {this.state.note}
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
