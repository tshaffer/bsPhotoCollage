import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import Modal from 'react-modal';

import { isNil } from 'lodash';

import {
  PhotoCollageState,
  DisplayedPhoto,
} from '../type';
import { PhotoCollageCanvas } from './PhotoCollageCanvas';

import {
  startPlayback,
} from '../controller';

export interface PhotoCollageComponentState {
  showModal: boolean;
  selectedPhoto: DisplayedPhoto | null;
}

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface PhotoCollageProps {
  onStartPlayback: () => any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class PhotoCollageComponent extends React.Component<
  PhotoCollageProps,
  PhotoCollageComponentState
  > {

  constructor(props: any) {
    super(props);

    this.state = {
      showModal: false,
      selectedPhoto: null,
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCloseModalResumePlayback = this.handleCloseModalResumePlayback.bind(this);
    this.handleSelectPhoto = this.handleSelectPhoto.bind(this);
  }

  componentDidMount() {
    console.log('PhotoCollage componentDidMount invoked');
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleCloseModalResumePlayback() {
    this.setState({ showModal: false });
    this.props.onStartPlayback();
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

    // TEDTODO - are width and height scaled values vs. file values?
    return (
      <div>
        <p>Selected photo:</p>
        <p>{selectedPhoto.photoSpec.fileName}</p>
        <p>{selectedPhoto.photoSpec.filePath}</p>
        <p>Width</p>
        <p>{selectedPhoto.width}</p>
        <p>Height</p>
        <p>{selectedPhoto.height}</p>
        <button onClick={this.handleCloseModalResumePlayback}>Resume</button>
        <button
          style={{
            marginLeft: '16px'
          }}
          onClick={this.handleCloseModal}
        >
          Close
        </button>
      </div>
    );
  }

  handleSelectPhoto(selectedPhoto: any) {
    Modal.setAppElement('#collageCanvas');
    this.setState({
      selectedPhoto,
      showModal: true,
    });
  }

  render() {

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
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    onStartPlayback: startPlayback,
  }, dispatch);
};

export const PhotoCollage = connect(mapStateToProps, mapDispatchToProps)(PhotoCollageComponent);
