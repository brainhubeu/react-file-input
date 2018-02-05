import React from 'react';
import { string, number } from 'prop-types';
import '../styles/FileInputMetadata.scss';

const FileInputMetadata = props => <div className="BrainhubFileInput__metadata">
  <div className="BrainhubFileInput__metadata__filename">Filename: {props.filename}</div>
  <div className="BrainhubFileInput__metadata__size">Size: {props.size}</div>
</div>;

FileInputMetadata.propTypes = {
  filename: string.isRequired,
  size: number.isRequired,
};

export default FileInputMetadata;

