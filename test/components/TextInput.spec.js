import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import TextInput from '../../src/components/TextInput';

const defaultProps = {
  placeholder: 'Test Placeholder',
  onChange: () => null,
};

const setup = (props = {}) => {
  const textInput = shallow(<TextInput {...defaultProps} {...props} />);

  return {
    textInput,
    input: textInput.find('input'),
  };
};

describe('components', () => {
  describe('TextInput', () => {
    it('should render a text input', () => {
      const { input } = setup();

      expect(input).toHaveLength(1);
      expect(input.prop('placeholder')).toBe(defaultProps.placeholder);
      expect(input.prop('type')).toBe('text');
      expect(input.prop('value')).toBe('');
    });

    it('should render a text input with the default value provided in props', () => {
      const value = 'test value';
      const { input } = setup({ value });

      expect(input.prop('value')).toBe(value);
    });

    it('should call onChange callback when input changes', () => {
      const onChange = jest.fn();
      const { input } = setup({ onChange });

      input.simulate('change');
      expect(onChange).toHaveBeenCalled();
    });

    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <TextInput {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
