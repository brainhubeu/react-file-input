import React from 'react';
import filesize from 'filesize';
import { string, number } from 'prop-types';

import findMimeTypeByFilename from '../helpers/mime';

import '../styles/FileInputMetadata.scss';

const styleName = name => {
  const typeIndex = name.lastIndexOf('.');

  return {
    name: name.slice(0, typeIndex),
    extension: name.slice(typeIndex),
  };
};

const FileInputMetadata = props => {
  const { name, extension } = styleName(props.name);
  const mimeType = props.type || findMimeTypeByFilename(props.name);
  const size = filesize(props.size, { separator: ',' });

  return (<div className="brainhub-file-input__metadata">
    <div className="brainhub-file-input__metadata__image">

      {/* TODO: Replace div with real thumbnail */}
      <div style={{ width: '20px', height: '20px', backgroundColor: '#5680BB' }}></div>

    </div>
    <div className="brainhub-file-input__metadata__info">
      <span className="brainhub-file-input__metadata__info_name">{name}</span>{extension} ({size}) {mimeType}
    </div>
  </div>);
};

FileInputMetadata.defaultProps = {
  type: '',
};

FileInputMetadata.propTypes = {
  name: string.isRequired,
  type: string,
  size: number.isRequired,
};

export default FileInputMetadata;

