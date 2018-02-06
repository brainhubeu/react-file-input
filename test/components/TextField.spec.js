import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import TextField from '../../src/components/TextField';
import TextInput from '../../src/components/TextInput';

const defaultProps = {
  label: 'Test Label',
  placeholder: 'Test Placeholder',
  onChange: () => null,
};

const setup = (props = {}) => {
  const textField = shallow(<TextField {...defaultProps} {...props} />);

  return {
    textField,
    label: textField.find('.brainhub-text-field__label'),
    input: textField.find(TextInput),
  };
};

describe('components', () => {
  describe('TextField', () => {
    it('should render a label', () => {
      const { label } = setup();

      expect(label).toHaveLength(1);
      expect(label.text()).toBe(defaultProps.label);
    });

    it('should render a TextInput', () => {
      const { input } = setup();

      expect(input).toHaveLength(1);
      expect(input.prop('placeholder')).toBe(defaultProps.placeholder);
      expect(input.prop('onChange')).toBe(defaultProps.onChange);
    });

    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <TextField {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
