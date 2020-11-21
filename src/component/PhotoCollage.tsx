import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import * as fs from 'fs-extra';
import Modal from 'react-modal';

import { isNil } from 'lodash';

import { photoCollageConfig } from '../config';

import {
  PhotoCollageState,
  PhotoCollageSpec,
  PhotoInCollageSpec,
  PhotoCollection,
  PhotoInCollection,
  DisplayedPhoto,
} from '../type';
import { getActivePhotoCollageSpec, getPhotosRootDirectory } from '../selector';
import { getPhotoCollection } from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection,
} from '../utilities';

export interface PhotoCollageComponentState {
  imageCount: number;
  showModal: boolean;
  selectedPhoto: DisplayedPhoto | null;
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
  photoImages: DisplayedPhoto[];

  constructor(props: any) {
    super(props);

    this.state = {
      imageCount: 0,
      showModal: false,
      selectedPhoto: null,
    };

    this.photoImages = [];

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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

  handleClick(e: any) {

    const elem = this.canvasRef;
    const elemLeft = elem.offsetLeft + elem.clientLeft;
    const elemTop = elem.offsetTop + elem.clientTop;

    const x = e.pageX - elemLeft;
    const y = e.pageY - elemTop;

    // Get selected photo
    const index = 0;
    for (const photoImage of this.photoImages) {
      if (y > photoImage.y && y < photoImage.y + photoImage.height
        && x > photoImage.x && x < photoImage.x + photoImage.width) {
        console.log('clicked photo with index');
        console.log(index);

        Modal.setAppElement('#collageCanvas');
        this.setState({
          showModal: true,
          selectedPhoto: this.photoImages[index],
        });

        return;
      }
    }

    this.setState({
      showModal: false,
      selectedPhoto: null,
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
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
      const filePath: string = getRelativeFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);
      // const filePath: string = getFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);

      console.log('photo filePath:');
      console.log(filePath);


      const screenCoordinates = this.getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageConfig.width, photoCollageConfig.height);

      this.photoImages.push({
        x: screenCoordinates.x,
        y: screenCoordinates.y,
        width: screenCoordinates.width,
        height: screenCoordinates.height,
        photoInCollection,
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
        <Modal
          isOpen={this.state.showModal}
          contentLabel='Minimal Modal Example'
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 100,
              bottom: 200,
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            },
            content: {
              position: 'absolute',
              top: '40px',
              left: '40px',
              right: '40px',
              bottom: '40px',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '4px',
              outline: 'none',
              padding: '20px'
            }
          }}
        >
          <div>
            Selected photo:
            {this.state.selectedPhoto?.photoInCollection.fileName}
            <button onClick={this.handleCloseModal}>Close Modal</button>
          </div>
        </Modal>
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
