import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Icon from '../../src/components/Icon';

const defaultProps = {
  icon: [
    128,
    256,
    [],
    'string',
    'path',
  ],
};

const setup = (props = {}) => {
  const icon = shallow(<Icon {...defaultProps} {...props} />);

  return {
    icon,
    svg: icon.find('svg'),
    path: icon.find('path'),
  };
};

describe('components', () => {
  describe('Icon', () => {
    it('should render a svg', () => {
      const { svg } = setup();

      expect(svg).toHaveLength(1);
      expect(svg.prop('viewBox')).toBe(`0 0 ${defaultProps.icon[0]} ${defaultProps.icon[1]}`);
    });

    it('should render a path', () => {
      const { path } = setup();

      expect(path).toHaveLength(1);
      expect(path.prop('d')).toBe(defaultProps.icon[4]);
      expect(path.prop('fill')).toBe('currentColor');
    });

    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <Icon {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
