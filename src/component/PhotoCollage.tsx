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
  PhotoCollection,
  PhotoInCollection,
  DisplayedPhoto,
} from '../type';
import { PhotoCollageCanvas } from './PhotoCollageCanvas';

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
  intervalId: any;

  constructor(props: any) {
    super(props);

    this.state = {
      imageCount: 0,
      showModal: false,
      selectedPhoto: null,
    };

    this.photoImages = [];
    this.intervalId = -1;

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  shouldComponentUpdate(nextProps: PhotoCollageProps, nextState: PhotoCollageComponentState): boolean {
    // if (this.state.imageCount !== nextState.imageCount) {
    //   return true;
    // }
    // if (this.state.showModal !== nextState.showModal) {
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
    const index = 0;
    for (const photoImage of this.photoImages) {
      if (y > photoImage.y && y < photoImage.y + photoImage.height
        && x > photoImage.x && x < photoImage.x + photoImage.width) {
        console.log('clicked photo with index');
        console.log(index);

        clearInterval(this.intervalId);

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
    // this.startTimer();
  }

  renderDialog(): any {
    if (isNil(this.state.selectedPhoto)) {
      return (
        <div>
          <button onClick={this.handleCloseModal}>Close Modal</button>
        </div>
      );
    }
    const selectedPhoto: DisplayedPhoto = this.state.selectedPhoto;
    return (
      <div>
        <p>Selected photo:</p>
        <p>{selectedPhoto.photoInCollection.fileName}</p>
        <p>Width</p>
        <p>{selectedPhoto.photoInCollection.width}</p>
        <p>Height</p>
        <p>{selectedPhoto.photoInCollection.height}</p>
        <button onClick={this.handleCloseModal}>Close Modal</button>
      </div>
    );
  }

  render() {

    console.log('render');
    console.log(this.canvasRef);
    console.log(this.state.imageCount);

    return (
      <div>
        <PhotoCollageCanvas/>
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
          {this.renderDialog()}
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
