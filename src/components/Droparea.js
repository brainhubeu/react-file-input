import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Droparea.scss';

const Droparea = ({ dragging, onDragEnter, onDragLeave, onDrop, openFileDialog }) => {
  const className = dragging
    ? `brainhub-droparea  brainhub-droparea--dragging`
    : `brainhub-droparea`;

  return (
    <div
      className={className}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {dragging
        ? (<div className="brainhub-drpoparea__info">Drop here to select file.</div>)
        : (<div className="brainhub-drpoparea__button" role="button" tabIndex={-1} onClick={openFileDialog}>+ Add File</div>)
      }
    </div>
  );
};

Droparea.defaultProps = {
  dragging: false,
};

Droparea.propTypes = {
  dragging: PropTypes.bool,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  openFileDialog: PropTypes.func.isRequired,
};

export default Droparea;
