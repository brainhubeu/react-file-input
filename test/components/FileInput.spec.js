import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FileInput from '../../src/components/FileInput';

const defaultProps = {};

const setup = (props = {}) => {
  const fileInput = shallow(<FileInput {...defaultProps} {...props} />);

  return {
    fileInput,
    input: fileInput.find('input'),
  };
};

describe('components', () => {
  describe('FileInput', () => {
    it('should render a file input', () => {
      const { input } = setup();

      expect(input).toHaveLength(1);
      expect(input.prop('type')).toBe('file');
    });
    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <FileInput {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
