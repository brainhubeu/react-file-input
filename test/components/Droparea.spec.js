import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Droparea from '../../src/components/Droparea';

const defaultProps = {
  onDragEnter: () => null,
  onDragLeave: () => null,
  onDrop: () => null,
  openFileDialog: () => null,
};

const setup = (props = {}) => {
  const droparea = shallow(<Droparea {...defaultProps} {...props} />);

  return {
    droparea,
  };
};

describe('components', () => {
  describe('Droparea', () => {
    it('should render an add button by default', () => {
      const { droparea } = setup();

      const button = droparea.find('.brainhub-drpoparea__button');
      const info = droparea.find('.brainhub-drpoparea__info');

      expect(button).toHaveLength(1);
      expect(info).toHaveLength(0);

      expect(button.text()).toBe('+ Add File');
      expect(button.prop('role')).toBe('button');
      expect(button.prop('onClick')).toBe(defaultProps.openFileDialog);
    });

    it('should render an info message if it is dragging', () => {
      const { droparea } = setup({ dragging: true });

      const button = droparea.find('.brainhub-drpoparea__button');
      const info = droparea.find('.brainhub-drpoparea__info');

      expect(button).toHaveLength(0);
      expect(info).toHaveLength(1);

      expect(info.text()).toBe('Drop here to select file.');
    });

    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <Droparea {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('should match exact snapshot when dragging', () => {
      const tree = renderer.create(
        <div>
          <Droparea {...defaultProps} dragging />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
