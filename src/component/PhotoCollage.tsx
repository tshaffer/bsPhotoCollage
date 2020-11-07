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

  constructor(props: any) {
    super(props);

    this.state = {
      note: 'noNote',
    };

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

  getFilePathFromPhotoId(id: string): string {
    return '';
  }

  getPhotosInCollage() {
    const { collageWidth, collageHeight, photosInCollageSpecs } = this.props.photoCollageSpec!;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { x, y, width, height } = photosInCollageSpec;

      const photoInCollection: PhotoInCollection = this.getPhoto(width >= height);
      console.log('photo: ', photoInCollection);
      console.log(this.props.photoCollection);
      const filePath: string = getFilePathFromPhotoInCollection(this.props.photosRootDirectory, photoInCollection);
    }
  }

  // for each photo, need
  //    filePath
  //    width
  //    height
  renderPhotoCollage() {
    if (isNil(this.props.photoCollageSpec) ||
      isNil(this.props.photoCollection) ||
      isNil(this.props.photoCollection!.photosInCollection) ||
      this.props.photoCollection.photosInCollection.length === 0) {
      console.log('no photoCollageSpec or no photosInCollection');
      return null;
    } else {
      this.getPhotosInCollage();
      return null;
    }
  }

  render() {

    console.log('render');
    console.log(this.canvasRef);
    
    const poo = this.renderPhotoCollage();

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {

      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

      const natureImage = new Image();
      natureImage.onload = () => {
        context.drawImage(natureImage, 0, 0);
      };
      natureImage.src = 'nature.jpg';

      const lionImage = new Image();
      lionImage.onload = () => {
        context.drawImage(lionImage, 551, 0);
      };
      lionImage.src = 'lion.png';

    }

    // 551x310
    // 420x420
    return (
      <div>
        <canvas
          id='flibbet'
          width='971'
          height='420'
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
