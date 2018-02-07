import React from 'react';
import filesize from 'filesize';
import { string, number } from 'prop-types';
import '../styles/FileInputMetadata.scss';

const styleName = name => {
  const filenameChunks = name.split('.');
  const filenameChunksLength = filenameChunks.length;

  return filenameChunks
    .reduce((prev, curr, index) => {
      const name = prev.name || '';
      const extension = prev.extension || '';
      const lastElement = index === filenameChunksLength - 1;
      const lastElementWithoutExtension = index + 1 === filenameChunksLength - 1;

      return lastElement
        ? Object.assign(prev, { extension: extension + curr })
        : Object.assign(prev, { name: lastElementWithoutExtension ? name + curr : name + curr + '.' });
    }, {});
};

const FileInputMetadata = props => {
  const { name, extension } = styleName(props.name);
  return (<div className="brainhub-file-input__metadata">
    <div className="brainhub-file-input__metadata__info">
      <span className="brainhub-file-input__metadata__info_name">{name}</span>.{extension} ({filesize(props.size, { separator: ',' })})</div>
  </div>);
};

FileInputMetadata.propTypes = {
  name: string.isRequired,
  size: number.isRequired,
};

export default FileInputMetadata;

