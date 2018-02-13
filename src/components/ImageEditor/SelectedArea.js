import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import '../../styles/ImageEditor.scss';

class SelectedArea extends PureComponent {
  constructor(props) {
    super(props);

    this.selectedArea = null;

    this.startMove = this.startMove.bind(this);

    this.resizeTopLeft = this.resizeTopLeft.bind(this);
    this.resizeTop = this.resizeTop.bind(this);
    this.resizeTopRight = this.resizeTopRight.bind(this);
    this.resizeRight = this.resizeRight.bind(this);
    this.resizeBottomRight = this.resizeBottomRight.bind(this);
    this.resizeBottom = this.resizeBottom.bind(this);
    this.resizeBottomLeft = this.resizeBottomLeft.bind(this);
    this.resizeLeft = this.resizeLeft.bind(this);
  }

  resizeTopLeft(event) {
    const { startResize } = this.props;

    startResize(event, true, true, false);
  }

  resizeTop(event) {
    const { startResize } = this.props;

    startResize(event, false, true, true, true);
  }

  resizeTopRight(event) {
    const { startResize } = this.props;

    startResize(event, false, true);
  }

  resizeRight(event) {
    const { startResize } = this.props;

    startResize(event, false, false, true);
  }

  resizeBottomRight(event) {
    const { startResize } = this.props;

    startResize(event, false, false);
  }

  resizeBottom(event) {
    const { startResize } = this.props;

    startResize(event, false, false, true, true);
  }

  resizeBottomLeft(event) {
    const { startResize } = this.props;

    startResize(event, true, false);
  }

  resizeLeft(event) {
    const { startResize } = this.props;

    startResize(event, true, false, true);
  }

  startMove(event) {
    if (event.target === this.selectedArea) {
      const { startMove } = this.props;

      startMove(event);
    }
  }

  render() {
    const { style } = this.props;

    return (
      <div
        className="brainhub-image-editor__selected-area"
        ref={ref => {
          this.selectedArea = ref;
        }}
        style={style}
        onMouseDown={this.startMove} >
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--tl"
          onMouseDown={this.resizeTopLeft}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--t"
          onMouseDown={this.resizeTop}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--tr"
          onMouseDown={this.resizeTopRight}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--r"
          onMouseDown={this.resizeRight}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--br"
          onMouseDown={this.resizeBottomRight}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--b"
          onMouseDown={this.resizeBottom}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--bl"
          onMouseDown={this.resizeBottomLeft}
        />
        <div
          className="brainhub-image-editor__resize-point brainhub-image-editor__resize-point--l"
          onMouseDown={this.resizeLeft}
        />
      </div>
    );
  }
}

SelectedArea.defaultProps = {
  style: {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
};

SelectedArea.propTypes = {
  style: PropTypes.shape({
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
  }),
  startMove: PropTypes.func.isRequired,
  startResize: PropTypes.func.isRequired,
};

export default SelectedArea;
