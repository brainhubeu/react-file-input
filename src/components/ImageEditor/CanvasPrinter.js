import React, { PureComponent } from 'react';

import '../../styles/ImageEditor.scss';

const calculateOffset = (width, height, scaleOptions, inverted = false) => {
  const aspectRatio = inverted
    ? scaleOptions.height / scaleOptions.width
    : scaleOptions.width / scaleOptions.height;

  const horizontal = width < height * aspectRatio;

  return !horizontal
    ? { x: (width - (height * aspectRatio)) / 2, y: 0 }
    : { x: 0, y: (height - (width / aspectRatio)) / 2 };
};


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

    const sourceSize = { width: naturalWidth - (2 * offset.x), height: naturalWidth - (2 * offset.x) };

    return this.printImage(image, offset, sourceSize, scaleOptions);
  }


  rotateAndScaleImage(image, angle, scaleOptions = null) {
    const { naturalWidth, naturalHeight } = image;
    const baseWidth = (scaleOptions && scaleOptions.width) || naturalWidth;
    const baseHeight = (scaleOptions && scaleOptions.height) || naturalHeight;

    const inverted = !(angle %2 === 0);

    const width = (inverted && baseHeight) || baseWidth;
    const height = (inverted && baseWidth) || baseHeight;

    this.canvas.width = baseWidth;
    this.canvas.height = baseHeight;

    const offset = scaleOptions && scaleOptions.keepAspectRatio
      ? calculateOffset(naturalWidth, naturalHeight, scaleOptions, inverted)
      : { x: 0, y: 0 };

    const context = this.canvas.getContext('2d');

    context.translate(baseWidth / 2, baseHeight / 2);
    context.rotate((angle * Math.PI) /2);
    context.drawImage(
      image,
      offset.x,
      offset.y,
      naturalWidth - (2 * offset.x),
      naturalHeight - (2 * offset.y),
      - width / 2,
      - height / 2,
      width,
      height,
    );

    return new Promise(resolve => {
      this.canvas.toBlob(resolve);
    });
  }

  rotateImage(image, angle, scaleOptions = null) {
    const { naturalWidth, naturalHeight } = image;

    const inverted = !(angle %2 === 0);

    const width = (inverted && naturalHeight) || naturalWidth;
    const height = (inverted && naturalWidth) || naturalHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');

    context.translate(width / 2, height / 2);
    context.rotate((angle * Math.PI) /2);
    context.drawImage(
      image,
      - naturalWidth / 2,
      - naturalHeight / 2,
    );

    return new Promise(resolve => {
      this.canvas.toBlob(resolve);
    });
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
