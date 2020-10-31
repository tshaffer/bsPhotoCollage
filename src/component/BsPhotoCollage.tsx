import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
const fs = require('fs');

import {
  BsPhotoCollageState,
} from '../type';
import { isNil } from 'lodash';

export interface BsPhotoCollageProps {
  toppings: string;
}

export interface BsPhotoCollageComponentState {
  note: string;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class BsPhotoCollageComponent extends React.Component<
  BsPhotoCollageProps,
  BsPhotoCollageComponentState
  > {

  canvasRef: any;
  setCanvasRef: any;
  ctx: any;

  fileWritten: boolean;
  natureDrawn: boolean;
  lionDrawn: boolean;

  constructor(props: any) {
    super(props);

    this.state = {
      note: 'noNote',
    };

    this.setCanvasRef = (element: any) => {
      this.canvasRef = element;
      this.ctx = element.getContext('2d');
    };

    this.fileWritten = false;
    this.natureDrawn = false;
    this.lionDrawn = false;
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

  // 
  writeFile() {
    if (!this.fileWritten) {
      // const img1 = this.ctx.getImageData(0, 0, 971, 420);
      // const data = img1.data;
      // const buffer = new ArrayBuffer(data.length);
      // const binary = new Uint8Array(buffer);
      // for (let i = 0; i < binary.length; i++) {
      //   binary[i] = data[i];
      // }
      // // const buffer = imageData.data.buffer;
      // // const buffer = this.canvasRef.toBuffer('image/png');
      // fs.writeFileSync('./flibbet.png', binary);
      // this.fileWritten = true;
    }
  }

  render() {

    console.log('render');
    console.log(this.canvasRef);

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {

      const context = this.ctx;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

      const natureImage = new Image();
      natureImage.onload = () => {
        context.drawImage(natureImage, 0, 0);
        if (this.lionDrawn) {
          this.writeFile();
        } else {
          this.natureDrawn = true;
        }
      };
      natureImage.src = 'nature.jpg';

      const lionImage = new Image();
      lionImage.onload = () => {
        context.drawImage(lionImage, 551, 0);
        if (this.natureDrawn) {
          this.writeFile();
        } else {
          this.lionDrawn = true;
        }
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

function mapStateToProps(state: BsPhotoCollageState): Partial<any> {
  return {
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
  }, dispatch);
};

export const BsPhotoCollage = connect(mapStateToProps, mapDispatchToProps)(BsPhotoCollageComponent);
