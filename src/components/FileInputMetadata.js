import React from 'react';
import { string, number } from 'prop-types';
import '../styles/FileInputMetadata.scss';

const FileInputMetadata = props => <div className="brainhubFileInput__metadata">
  <div className="brainhubFileInput__metadata__name">{props.name}</div> ({props.size})
</div>;

FileInputMetadata.propTypes = {
  name: string.isRequired,
  size: number.isRequired,
};

export default FileInputMetadata;

