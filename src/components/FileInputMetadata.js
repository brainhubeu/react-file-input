import React from 'react';
import filesize from 'filesize';
import { string, number } from 'prop-types';
import '../styles/FileInputMetadata.scss';

const styleName = name => {
  const typeIndex = name.lastIndexOf('.');

  return {
    name: name.slice(0, typeIndex),
    type: name.slice(typeIndex),
  };
};

const FileInputMetadata = props => {
  const { name, type } = styleName(props.name);
  return (<div className="brainhub-file-input__metadata">
    <div className="brainhub-file-input__metadata__image">

      {/* TODO: Replace div with real thumbnail */}
      <div style={{ width: '20px', height: '20px', backgroundColor: '#5680BB' }}></div>

    </div>
    <div className="brainhub-file-input__metadata__info">
      <span className="brainhub-file-input__metadata__info_name">{name}</span>{type} ({filesize(props.size, { separator: ',' })})</div>
  </div>);
};

FileInputMetadata.propTypes = {
  name: string.isRequired,
  size: number.isRequired,
};

export default FileInputMetadata;

