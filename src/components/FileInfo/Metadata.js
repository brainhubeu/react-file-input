import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

import '../../styles/FileInfo.scss';

const Metadata = ({ extension, name, size, type }) => {
  const formattedSize = filesize(size, { separator: ',' });

  return (
    <div className="brainhub-file-info__metadata">
      <div className="brainhub-file-info__metadata__info">
        <span className="brainhub-file-info__metadata__info_name">{name}</span>{extension ? `.${extension}`: ''} ({formattedSize}) {type}
      </div>
    </div>
  );
};

Metadata.defaultProps = {
  extension: '',
  type: '',
};

Metadata.propTypes = {
  extension: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.number.isRequired,
};

export default Metadata;

