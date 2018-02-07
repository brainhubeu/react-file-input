import React from 'react';
import filesize from 'filesize';
import { string, number } from 'prop-types';

import '../styles/FileInputMetadata.scss';

const FileInputMetadata = props => {
  const { extension, name, type, size } = props;
  const formattedSize = filesize(size, { separator: ',' });

  return (<div className="brainhub-file-input__metadata">
    <div className="brainhub-file-input__metadata__info">
      <span className="brainhub-file-input__metadata__info_name">{name}</span>{extension ? `.${extension}`: ''} ({formattedSize}) {type}
    </div>
  </div>);
};

FileInputMetadata.defaultProps = {
  extension: '',
  type: '',
};

FileInputMetadata.propTypes = {
  extension: string,
  name: string.isRequired,
  type: string,
  size: number.isRequired,
};

export default FileInputMetadata;

