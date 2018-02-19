import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import DropArea from '../../src/components/DropArea';

const defaultProps = {
  onDragEnter: () => null,
  onDragLeave: () => null,
  onDrop: () => null,
  openFileDialog: () => null,
};

const setup = (props = {}) => {
  const dropArea = shallow(<DropArea {...defaultProps} {...props} />);

  return {
    dropArea,
  };
};

describe('components', () => {
  describe('DropArea', () => {
    it('should render an add button by default', () => {
      const { dropArea } = setup();

      const button = dropArea.find('.brainhub-drop-area__button');
      const info = dropArea.find('.brainhub-drop-area__info');

      expect(button).toHaveLength(1);
      expect(info).toHaveLength(0);

      expect(button.text()).toBe('+ Add File');
      expect(button.prop('role')).toBe('button');
      expect(button.prop('onClick')).toBe(defaultProps.openFileDialog);
    });

    it('should render an info message if it is dragging', () => {
      const { dropArea } = setup({ dragging: true });

      const button = dropArea.find('.brainhub-drop-area__button');
      const info = dropArea.find('.brainhub-drop-area__info');

      expect(button).toHaveLength(0);
      expect(info).toHaveLength(1);

      expect(info.text()).toBe('Drop here to select file.');
    });

    it('should render with custom class if defined', () => {
      const className = 'custom_class';
      const { dropArea } = setup({ className });

      expect(dropArea.find('div').first().hasClass(className)).toBeTruthy();
      expect(dropArea.find('div').first().hasClass('brainhub-drop-area')).toBeTruthy();

      dropArea.setProps({ dragging: true });

      expect(dropArea.find('div').first().hasClass(className)).toBeTruthy();
      expect(dropArea.find('div').first().hasClass('brainhub-drop-area')).toBeTruthy();
      expect(dropArea.find('div').first().hasClass('brainhub-drop-area--dragging')).toBeTruthy();
    });

    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <DropArea {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('should match exact snapshot when dragging', () => {
      const tree = renderer.create(
        <div>
          <DropArea {...defaultProps} dragging />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
