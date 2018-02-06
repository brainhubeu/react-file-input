import React from 'react';
import PropTypes from 'prop-types';

import TextInput from './TextInput';

import '../styles/TextField.scss';

const TextField = ({ label, placeholder, value, onChange }) => (
  <div className="brainhub-text-field">
    <div className="brainhub-text-field__label">{label}</div>
    <div>
      <TextInput placeholder={placeholder} value={value} onChange={onChange}/>
    </div>
  </div>
);

TextField.defaultProps = {
  value: '',
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextField;
