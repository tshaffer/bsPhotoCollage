import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { isEmpty, isNil } from 'lodash';

import { photoCollageConfig } from '../config';

import {
  PhotoCollageState,
  PhotoCollageSpec,
  PhotoCollection,
  PhotoInCollection,
  DisplayedPhoto,
  PhotoInCollageSpec,
} from '../type';
import {
  startPlayback,
  stopPlayback,
} from '../controller';

import { getActivePhotoCollageSpec, getPhotoCollageFilesSpec, getPhotosInCollage } from '../selector';
import { getPhotoCollection } from '../selector';

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
  photoCollection: PhotoCollection;
  photoCollageSpec: PhotoCollageSpec | null;
  photoCollageFilesSpec: string;
  photosInCollage: PhotoInCollageSpec[];
  onStartPlayback: () => any;
  onStopPlayback: () => any;
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

  constructor(props: any) {
    super(props);

    this.state = {
      imageCount: 0,
      selectedPhoto: null,
    };

    this.photoImages = [];

    this.setCanvasRef = (element: any) => {
      // debugger;
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('PhotoCollageCanvas componentDidMount invoked');

    this.setState({
      imageCount: 1,
    });

    console.log('invoke onStartPlayback');
    this.props.onStartPlayback();
  }

  shouldComponentUpdate(nextProps: PhotoCollageCanvasProps, nextState: PhotoCollageCanvasComponentState): boolean {
    // if (this.state.imageCount !== nextState.imageCount) {
    //   return true;
    // }
    // return false;

    const currentTime = Math.floor(Date.now() / 1000);
    console.log('shouldComponentUpdate');
    console.log(this.props);
    console.log(nextProps);
    console.log(this.state);
    console.log(nextState);
    console.log(currentTime);
    return true;
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

        this.props.onStopPlayback();
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

    const photosInCollage: PhotoInCollageSpec[] = this.props.photosInCollage;
    if (photosInCollage.length === 0) {
      return;
    }
    
    // const photoCollageFilesSpec: string = this.props.photoCollageFilesSpec;
    // const photoCollageFilesSpecs: string[] = photoCollageFilesSpec.split('|');

    this.photoImages = [];
    const { collageWidth, collageHeight, photosInCollageSpecs } = this.props.photoCollageSpec!;
    let index = 0;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { x, y, width, height } = photosInCollageSpec;

      if (!isNil(photosInCollage[index].filePath)) {
        const filePath = photosInCollage[index].filePath!;

        const screenCoordinates = this.getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageConfig.width, photoCollageConfig.height);

        this.photoImages.push({
          x: screenCoordinates.x,
          y: screenCoordinates.y,
          width: screenCoordinates.width,
          height: screenCoordinates.height,
          photoSpec: photosInCollage[index],
        });

        this.renderPhoto(
          'file:///' + filePath,
          screenCoordinates.x,
          screenCoordinates.y,
          screenCoordinates.width,
          screenCoordinates.height);
      }

      index++;
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

    // debugger;
    console.log('render PhotoCollageCanvas');
    console.log(this.canvasRef);
    console.log(this.state.imageCount);

    if (isNil(this.props.photoCollageFilesSpec) || this.props.photoCollageFilesSpec.length === 0) {
      console.log('photoCollageFilesSpec empty');
      console.log('canvasRef');
      console.log(this.canvasRef);
      // return null;
    }
    else {
      console.log('photoCollageFilesSpec not empty');
    }

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {
      console.log('canvasRef and ctx nil');
      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
      this.renderPhotoCollage();
    } else {
      console.log('canvasRef and ctx not nil');
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
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
    photoCollageFilesSpec: getPhotoCollageFilesSpec(state),
    photosInCollage: getPhotosInCollage(state),
    onSelectPhoto: ownProps.onSelectPhoto,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    onStartPlayback: startPlayback,
    onStopPlayback: stopPlayback,
  }, dispatch);
};

export const PhotoCollageCanvas = connect(mapStateToProps, mapDispatchToProps)(PhotoCollageCanvasComponent);
