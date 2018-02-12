import React from 'react';
import { string } from 'prop-types';
import '../styles/ImageThumbnail.scss';

const ImageThumbnail = props => <img src={props.image} className="brainhub-file-input__thumbnail" ></img>;

ImageThumbnail.propTypes = {
  image: string.isRequired,
};

ImageThumbnail.defaulProps = {
  image: null,
};

export default ImageThumbnail;
