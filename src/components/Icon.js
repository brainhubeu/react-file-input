import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ icon }) => {
  const [width, height, , , path] = icon;

  return (
    <svg
      style={{
        display: 'inline-block',
        fontSize: 'inherit',
        height: '1em',
        overflow: 'visible',
        verticalAlign: '-.125em',
        width: '1em',
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path d={path} fill="currentColor"/>
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ])).isRequired,

};

export default Icon;
