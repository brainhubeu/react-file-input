import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectedArea from './SelectedArea';

import '../styles/ImageEditor.scss';

const between = (value, max, min =0) => Math.max(Math.min(value, max), min);

/**
 * @todo Change selected area for selection
 */

class ImageEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      landscape: true,
      isSelecting: false,
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      isMoving: false,
      xM: 0,
      yM: 0,
    };

    this.container = null;
    this.image = null;
    this.selected = null;

    this.onImageLoad = this.onImageLoad.bind(this);
    this.getSelectedAreaBoundaries = this.getSelectedAreaBoundaries.bind(this);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.startResize = this.startResize.bind(this);
    this.resize = this.resize.bind(this);
    this.endResize = this.endResize.bind(this);

    this.startMove = this.startMove.bind(this);
    this.moveSelectedArea = this.moveSelectedArea.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('onmousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  /**
   * Set initial selection area according to the maximum posible, and the landscape orientation
   */
  onImageLoad() {
    const { ratio } = this.props;
    const { clientWidth: width, clientHeight: height } = this.image;

    const landscape = width > height * ratio;

    const selectionWidth = landscape ? (height * ratio) : width;
    const selectionHeight = landscape ? height : (width / ratio);

    const xOffset = landscape ? ((width - selectionWidth) / 2) : 0;
    const yOffset = landscape ? 0 : ((height - selectionHeight) / 2);

    this.setState(state => ({
      ...state,
      landscape,
      x0: xOffset,
      y0: yOffset,
      x1: width - xOffset,
      y1: height - yOffset,
    }));
  }

  /**
   * Calculate and set the original selection points in the states, and also set isSelecting flag
   * @param {Event} event Mouse event
   */
  startResize(event) {
    event.preventDefault();

    const { offsetLeft: containerLeft, offsetTop: containerTop } = this.container;
    const { clientWidth: width, clientHeight: height, offsetLeft: imageLeft, offsetTop: imageTop } = this.image;
    const { pageX: mouseX, pageY: mouseY } = event;

    // Calculate points relative to the image
    const clickX = mouseX - containerLeft - imageLeft;
    const clickY = mouseY - containerTop - imageTop;

    // Calculates the real posible point (i.e point tha falls between image boundaries)
    const x = between(clickX, width);
    const y = between(clickY, height);

    this.setState(state => ({
      ...state,
      isSelecting: true,
      x0: x,
      y0: y,
      x1: x,
      y1: y,
    }));
  }

  resize(event) {
    event.preventDefault();

    const { ratio } = this.props;
    const { x0, y0, landscape } = this.state;
    const { clientWidth: width, clientHeight: height, offsetLeft: imageLeft, offsetTop: imageTop } = this.image;
    const { offsetLeft: containerLeft, offsetTop: containerTop } = this.container;

    const { pageX: mouseX, pageY: mouseY } = event;

    // Calculate points relative to the image
    const clickX = mouseX - containerLeft - imageLeft;
    const clickY = mouseY - containerTop - imageTop;

    // Calculates the real posible point (i.e point tha falls between image boundaries)
    const x = between(clickX, width);
    const y = between(clickY, height);

    const point1 = landscape
      ? [(y - y0) * ratio + x0, y]
      : [x, (x - x0) / ratio + y0];

    if (point1[0] > width || point1[1] > height) {
      point1[0] = landscape ? width : ((height - y0) * ratio + x0);
      point1[1] = landscape ? ((width - x0) / ratio + y0) : height;
    } else if (point1[0] < 0 || point1[1] < 0) {
      point1[0] = landscape ? 0 : ( - (y0 * ratio) + x0);
      point1[1] = landscape ? ( - (x0 / ratio) + y0) : 0;
    }

    this.setState({ x1: point1[0], y1: point1[1] });
  }

  endResize(event) {
    event.preventDefault();

    this.setState(state => ({
      ...state,
      isSelecting: false,
      x0: Math.min(state.x0, state.x1),
      y0: Math.min(state.y0, state.y1),
      x1: Math.max(state.x0, state.x1),
      y1: Math.max(state.y0, state.y1),
    }));
  }

  startMove(event) {
    console.log('move');
    event.preventDefault();
    const { pageX: mouseX, pageY: mouseY } = event;
    const { clientWidth: width, clientHeight: height, offsetLeft: imageLeft, offsetTop: imageTop } = this.image;
    const { offsetLeft: containerLeft, offsetTop: containerTop } = this.container;

    this.setState({
      isMoving: true,
      xM: between(mouseX - imageLeft - containerLeft, width),
      yM: between(mouseY - imageTop - containerTop, height),
    });
  }

  moveSelectedArea(event) {
    event.preventDefault();
    const { x0, y0, x1, y1, xM, yM } = this.state;
    const { pageX: mouseX, pageY: mouseY } = event;
    const { clientWidth: width, clientHeight: height, offsetLeft: imageLeft, offsetTop: imageTop } = this.image;
    const { offsetLeft: containerLeft, offsetTop: containerTop } = this.container;

    // Calculates the real posible point (i.e point tha falls between image boundaries)

    const clickX = between(mouseX - containerLeft - imageLeft, width);
    const clickY = between(mouseY - containerTop - imageTop, height);

    const dX = clickX - xM;
    const dY = clickY - yM;
    console.log(dX, dY);

    // processX
    const realDX = dX > 0
      ? Math.min(dX, width - x1)
      : Math.max(dX, -x0);

    const realDY = dY > 0
      ? Math.min(dY, height - y1)
      : Math.max(dY, -y0);

    this.setState(state => ({
      xM: clickX,
      yM: clickY,
      x0: x0 + realDX,
      y0: y0 + realDY,
      x1: x1 + realDX,
      y1: y1 + realDY,

    }));

    console.log(dX, dY);
  }

  endMove(event) {
    event.preventDefault();
    this.setState({ isMoving: false, xM: 0, yM: 0 });
  }

  /**
   * Takes the selection points relative to the image and transform it into css absolute properties relative to the wrapping div
   * @return {Object} Object containing top, right, bottom and left css properties in percentage (or empty)
   */
  getSelectedAreaBoundaries() {
    if (!this.container) {
      return {};
    }
    const { x0, y0, x1, y1, landscape } = this.state;
    const { clientWidth: width, clientHeight: height } = this.container;
    const { offsetLeft, offsetTop } = this.image;

    const [p0, p1] = [[x0, y0], [x1, y1]].sort(([xA, yA], [xB, yB]) => {
      if (landscape) {
        return yA < yB ? -1 : 1;
      }
      return xA < xB ? -1 : 1;
    });


    return {
      top: `${100*(p0[1] + offsetTop) / height}%`,
      right: `${100*(width - p1[0] - offsetLeft) / width}%`,
      bottom: `${100*(height - p1[1] - offsetTop) / height}%`,
      left: `${100*(p0[0] + offsetLeft) / width}%`,
    };
  }

  onMouseDown(event) {
    if (this.selected !== event.target) {
      this.startResize(event);
    } else {
      this.startMove(event);
    }
  }

  onMouseMove(event) {
    const { isSelecting, isMoving }= this.state;
    if (isSelecting) {
      this.resize(event);
    } else if (isMoving) {
      this.moveSelectedArea(event);
    }
  }

  onMouseUp(event) {
    const { isSelecting, isMoving } = this.state;
    console.log('onMouseUp', isMoving, isSelecting);
    if (isSelecting) {
      this.endResize(event);
    } else if (isMoving) {
      console.log('isMoving');
      this.endMove(event);
    }
  }

  render() {
    const { image } = this.props;

    return (
      <div
        className="brainhub-image-editor"
        ref={ref => {
          this.container = ref;
        }}
        onMouseDown={this.onMouseDown}
      >
        <img
          ref={ref => {
            this.image = ref;
          }}
          className="brainhub-image-editor__image"
          src={image}
          onLoad={this.onImageLoad}/>
        <SelectedArea
          setRef={ref => {
            this.selected = ref;
          }}
          style={this.getSelectedAreaBoundaries()}
        />
      </div>);
  }
}

ImageEditor.defaultProps = {
  ratio: 2/3, // w/h
};

ImageEditor.propTypes = {
  image: PropTypes.string.isRequired,
  ratio: PropTypes.number,
};

export default ImageEditor;
