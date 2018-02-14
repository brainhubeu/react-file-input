import React, { PureComponent } from 'react';

import '../styles/CanvasPrinter.scss';

class CanvasPrinter extends PureComponent {
  constructor(props) {
    super(props);

    this.canvas = null;

    this.printImage = this.printImage.bind(this);
    this.cropAndResizeImage = this.cropAndResizeImage.bind(this);
    this.resizeImage = this.resizeImage.bind(this);
  }

  /**
   * [printImage description]
   * @param  {Image} image
   * @param  {{x: Number, y: Number}} offset
   * @param  {{width: Number, height: Number}} sourceSize
   * @param  {{width: Number, height: Number}} outputSize
   * @return {Promise<Blob>} Output image blob
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
   */
  printImage(image, offset, sourceSize, outputSize) {
    this.canvas.width = outputSize.width;
    this.canvas.height = outputSize.height;

    this.canvas
      .getContext('2d')
      .drawImage(
        image,
        offset.x,
        offset.y,
        sourceSize.width,
        sourceSize.height,
        0,
        0,
        outputSize.width,
        outputSize.height
      );

    return new Promise(resolve => {
      this.canvas.toBlob(resolve);
    });
  }

  cropAndResizeImage(image, area, scaleOptions = null) {
    const { clientHeight, clientWidth, naturalHeight, naturalWidth } = image;
    const { x0, y0, x1, y1 } = area;

    const widthFactor = naturalWidth / clientWidth;
    const heightFactor = naturalHeight / clientHeight;

    const offset = {
      x: x0 * widthFactor,
      y: y0 * heightFactor,
    };

    const sourceSize = {
      width: (x1 - x0 ) * widthFactor,
      height: (y1 - y0 ) * heightFactor,
    };

    return this.printImage(image, offset, sourceSize, scaleOptions || sourceSize);
  }

  resizeImage(image, scaleOptions) {
    if (!scaleOptions.keepAspectRatio) {
      return this.printImage(
        image,
        { x: 0, y: 0 },
        { width: image.naturalWidth, height: image.naturalHeight },
        scaleOptions
      );
    }

    const { naturalWidth, naturalHeight } = image;

    const aspectRatio = scaleOptions.width / scaleOptions.height;
    const horizontal = naturalWidth < naturalHeight * aspectRatio;

    const offset = !horizontal
      ? { x: (naturalWidth - (naturalHeight * aspectRatio)) / 2, y: 0 }
      : { x: 0, y: (naturalHeight - (naturalWidth / aspectRatio)) / 2 };

    const sourceSize = { width: naturalWidth - (2 * offset.x), height: naturalHeight - (2 * offset.y) };

    return this.printImage(image, offset, sourceSize, scaleOptions);
  }

  render() {
    return (
      <canvas
        className="brainhub-canvas-printer"
        ref={ref => {
          this.canvas = ref;
        }}
      />
    );
  }
}

export default CanvasPrinter;
