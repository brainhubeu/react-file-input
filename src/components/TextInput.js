import React from 'react';
import PropTypes from 'prop-types';

import '../styles/TextField.scss';

const TextInput = ({ placeholder, value, onChange }) => (
  <input
    className="brainhub-text-field__input"
    placeholder={placeholder}
    type="text"
    value={value}
    onChange={onChange}
  />
);

TextInput.defaultProps = {
  value: '',
};

TextInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextInput;
