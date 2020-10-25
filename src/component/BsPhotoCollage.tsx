import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { Dispatch, bindActionCreators } from 'redux';

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

  render() {

    console.log('render');
    console.log(this.canvasRef);

    if (!isNil(this.canvasRef) && !isNil(this.ctx)) {
      // const canvas = this.canvasRef.current;
      const context = this.ctx;
      // Our first draw
      context.fillStyle = '#000000';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    return (
      <div>
        <canvas
          id='flibbet'
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
