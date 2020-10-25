import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import {
  BsPhotoCollageState,
} from '../type';

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class BsPhotoCollageComponent extends React.Component<any> {

  render() {

    return (
      <div>pizza</div>
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
