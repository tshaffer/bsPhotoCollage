import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';

import { isNil } from 'lodash';

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

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
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
    console.log('selectedPhoto:');
    console.log(selectedPhoto);
    return (
      <div>
        Pesto Pizza
      </div>
    );
    // return (
    //   <div>
    //     <p>Selected photo:</p>
    //     <p>{selectedPhoto.photoInCollection.fileName}</p>
    //     <p>Width</p>
    //     <p>{selectedPhoto.photoInCollection.width}</p>
    //     <p>Height</p>
    //     <p>{selectedPhoto.photoInCollection.height}</p>
    //     <button onClick={this.handleCloseModal}>Close Modal</button>
    //   </div>
    // );
  }

  handleSelectPhoto(selectedPhoto: any) {
    console.log('handleSelectPhoto');
    console.log(selectedPhoto);
  }

  render() {

    console.log('render');
    console.log(this.canvasRef);
    console.log(this.state.imageCount);

    return (
      <div>
        <PhotoCollageCanvas
          onSelectPhoto={this.handleSelectPhoto}
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
