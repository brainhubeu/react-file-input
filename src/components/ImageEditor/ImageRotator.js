import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import '../../styles/ImageEditor.scss';

class ImageRotator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      angle: 0,
    };

    this.image = null;

    this.rotateOutwards = this.rotateOutwards.bind(this);
    this.rotateInwards = this.rotateInwards.bind(this);

    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { image } = this.props;

    if (nextProps.image !== image) {
      this.setState({ angle: 0 });
    }
  }

  rotateOutwards() {
    this.setState(state => ({
      ...state,
      angle: (state.angle + 4 - 1) % 4,
    }));
  }

  rotateInwards() {
    this.setState(state => ({
      ...state,
      angle: (state.angle + 1) % 4,
    }));
  }

  save() {
    const { onSave } = this.props;
    const { angle } = this.state;

    onSave(this.image, angle);
  }

  render() {
    const { image } = this.props;
    const { angle } = this.state;

    return (
      <div>
        <div className="brainhub-image-rotator">
          <img
            className="brainhub-image-rotator__image"
            src={image}
            style={{
              transform: `rotate(${angle * 90}deg)`,
            }}
            ref={ ref => {
              this.image = ref;
            }}
          />
        </div>
        <div>
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--arrow"
            onClick={this.rotateOutwards}>
            {`<-`}
          </button>
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--save"
            onClick={this.save}>
          Save image
          </button>
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--arrow"
            onClick={this.rotateInwards}>
            {`->`}
          </button>
        </div>
      </div>
    );
  }
}

ImageRotator.propTypes = {
  image: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ImageRotator;
