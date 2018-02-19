import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CanvasPrinter from './CanvasPrinter';
import CropTool from './CropTool';
import ImageRotator from './ImageRotator';

import '../../styles/ImageEditor.scss';

class ImageEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.canvasPrinter = null;

    this.state = {
      image: props.image,
      imageBlob: null,
      hasBeenRotated: false,
      hasBeenCropped: false,
    };

    this.revokeImageURL = this.revokeImageURL.bind(this);

    this.rotate = this.rotate.bind(this);
    this.rotateAndScale = this.rotateAndScale.bind(this);
    this.onRotate = this.onRotate.bind(this);

    this.onCrop = this.onCrop.bind(this);
    this.onCropCanceled = this.onCropCanceled.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { image } = this.props;

    if (nextProps.image !== image) {
      this.revokeImageURL();

      this.setState({
        image: nextProps.image,
        imageBlob: null,
        hasBeenRotated: false,
        hasBeenCropped: false,
      });
    }
  }

  componentWillUnmount() {
    this.revokeImageURL();
  }

  revokeImageURL() {
    const { image } = this.state;

    image && window.URL.revokeObjectURL(image);
  }

  async rotate(image, angle) {
    const blob = await this.canvasPrinter.rotateImage(image, angle);

    const newImage = window.URL.createObjectURL(blob);

    this.setState(state => ({
      ...state,
      image: newImage,
      imageBlob: blob,
      hasBeenRotated: true,
    }));
  }

  async rotateAndScale(image, angle) {
    const { scaleOptions, onEditionFinished } = this.props;

    const blob = scaleOptions
      ? await this.canvasPrinter.rotateAndScaleImage(image, angle, scaleOptions)
      : await this.canvasPrinter.rotateImage(image, angle);

    const newImage = window.URL.createObjectURL(blob);

    this.setState(state => ({
      ...state,
      image: newImage,
      imageBlob: blob,
      hasBeenRotated: true,
    }), () => {
      onEditionFinished(blob);
    });
  }

  onRotate(image, angle) {
    const { cropTool } = this.props;

    if (cropTool) {
      this.rotate(image, angle);
    } else {
      this.rotateAndScale(image, angle);
    }
  }

  async onCrop(image, area = null) {
    const { scaleOptions, onEditionFinished } = this.props;

    const blob = area
      ? await this.canvasPrinter.cropAndResizeImage(image, area, scaleOptions)
      : await this.canvasPrinter.resizeImage(image, scaleOptions);

    const newImage = URL.createObjectURL(blob);

    this.revokeImageURL();

    this.setState(state => ({
      ...state,
      image: newImage,
      imageBlob: blob,
      hasBeenCropped: true,
    }), () => {
      onEditionFinished(blob);
    });
  }

  onCropCanceled(image) {
    const { scaleOptions, onEditionFinished } = this.props;

    if (scaleOptions) {
      this.onCrop(image);
    } else {
      this.setState(state => ({
        ...state,
        hasBeenCropped: true,
      }), () => {
        const { imageBlob } = this.state;

        onEditionFinished(imageBlob);
      });
    }
  }

  render() {
    const { className, cropAspectRatio, cropTool } = this.props;
    const { hasBeenRotated, hasBeenCropped, image } = this.state;

    return (
      <div className={className || ''}>
        { !hasBeenRotated
          ? (<ImageRotator image={image} onSave={this.onRotate}/>)
          : null
        }
        { hasBeenRotated && cropTool && !hasBeenCropped
          ? (
            <CropTool
              aspectRatio={cropAspectRatio}
              image={image}
              onCancelEdition={this.onCropCanceled}
              onSaveEdition={this.onCrop}
            />
          )
          : null
        }
        <CanvasPrinter
          ref={ref => {
            this.canvasPrinter = ref;
          }}
        />
      </div>
    );
  }
}

ImageEditor.defaultProps = {
  className: '',
  cropAspectRatio: 0, // height / width
  cropTool: false,
  scaleOptions: null,
};

ImageEditor.propTypes = {
  className: PropTypes.string,
  cropAspectRatio: PropTypes.number,
  cropTool: PropTypes.bool,
  image: PropTypes.string.isRequired,
  scaleOptions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    keepAspectRatio: PropTypes.bool,
  }),
  onEditionFinished: PropTypes.func.isRequired,
};

export default ImageEditor;
