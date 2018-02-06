import React from 'react';
import filesize from 'filesize';
import { string, number } from 'prop-types';
import '../styles/FileInputMetadata.scss';

const styleName = name => {
  // Do we have list of supported image types ??
  const imageTypes = ['.jpg', '.jpeg', '.png', '.gif'];
  const typeIndex = imageTypes.map(type => name.indexOf(type));

  return {
    name: name.slice(0, typeIndex[0]),
    type: name.slice(typeIndex[0]),
  };
};

const FileInputMetadata = props => {
  const { name, type } = styleName(props.name);
  return (<div className="brainhubFileInput__metadata">
    <div className="brainhubFileInput__metadata__image">

      {/* This is placeholder for now */}
      <div style={{ width: '20px', height: '20px', backgroundColor: '#5680BB' }}></div>

    </div>
    <div className="brainhubFileInput__metadata__info">
      <span className="brainhubFileInput__metadata__info_name">{name}</span>{type} ({filesize(props.size, { separator: ',' })})</div>
  </div>);
};

FileInputMetadata.propTypes = {
  name: string.isRequired,
  size: number.isRequired,
};

export default FileInputMetadata;

