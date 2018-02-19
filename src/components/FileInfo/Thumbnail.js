import React from 'react';
import Proptypes from 'prop-types';

import '../../styles/FileInfo.scss';

const Thumbnail = ({ children }) => (
  <div className="brainhub-file-info__thumbnail">
    {children}
  </div>
);

Thumbnail.propTypes = {
  children: Proptypes.node.isRequired,
};

export default Thumbnail;
