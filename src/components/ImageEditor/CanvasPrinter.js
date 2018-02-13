import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import '../../styles/ImageEditor.scss';

class CanvasPrinter extends PureComponent {
  constructor(props) {
    super(props);

    this.canvas = null;

    this.drawImage = this.drawImage.bind(this);
  }

  drawImage(image, area) {
    if (this.canvas) {
      const { onCanvasDraw } = this.props;
      const { clientHeight, clientWidth, naturalHeight, naturalWidth } = image;
      const { x0, y0, x1, y1 } = area;

      const widthFactor = naturalWidth / clientWidth;
      const heightFactor = naturalHeight / clientHeight;

      const imageSourceArea = {
        x0: x0 * widthFactor,
        y0: y0 * heightFactor,
        x1: (x1 - x0 ) * widthFactor,
        y1: (y1 - y0 ) * heightFactor,
      };

      this.canvas.width = imageSourceArea.x1;
      this.canvas.height = imageSourceArea.y1;

      this.canvas
        .getContext('2d')
        .drawImage(
          image,
          imageSourceArea.x0,
          imageSourceArea.y0,
          imageSourceArea.x1,
          imageSourceArea.y1,
          0,
          0,
          imageSourceArea.x1,
          imageSourceArea.y1
        );

      this.canvas.toBlob(onCanvasDraw);
    }
  }


  render() {
    return (
      <canvas
        className="brainhub-canvas-editor__canvas_printer"
        ref={ref => {
          this.canvas = ref;
        }}
      />
    );
  }
}

CanvasPrinter.propTypes = {
  onCanvasDraw: PropTypes.func.isRequired,
};

export default CanvasPrinter;
