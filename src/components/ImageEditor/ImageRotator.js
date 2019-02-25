import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import faRedo from '@fortawesome/fontawesome-free-solid/faRedo';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';

import Icon from '../Icon';

import '../../styles/ImageEditor.scss';

class ImageRotator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      angle: 0,
    };

    this.image = null;

    this.rotateCounterClockwise = this.rotateCounterClockwise.bind(this);
    this.rotateClockwise = this.rotateClockwise.bind(this);

    this.save = this.save.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { image } = this.props;

    if (nextProps.image !== image) {
      this.setState({ angle: 0 });
    }
  }

  rotateCounterClockwise() {
    this.setState(state => ({
      ...state,
      angle: (state.angle + 4 - 1) % 4,
    }));
  }

  rotateClockwise() {
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
            ref={ref => {
              this.image = ref;
            }}
          />
        </div>
        <div className="brainhub-image-rotator__controls">
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--arrow"
            onClick={this.rotateCounterClockwise}
          >
            <Icon icon={faUndo.icon}/>
          </button>
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--save"
            onClick={this.save}
          >
          Save image
          </button>
          <button
            className="brainhub-image-rotator__button brainhub-image-rotator__button--arrow"
            onClick={this.rotateClockwise}
          >
            <Icon icon={faRedo.icon}/>
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
