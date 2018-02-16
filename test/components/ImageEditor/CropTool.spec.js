import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import CropTool from '../../../src/components/ImageEditor/CropTool';
import SelectedArea from '../../../src/components/ImageEditor/SelectedArea';

const defaultProps = {
  image: '',
  onCancelEdition: () => null,
  onSaveEdition: () => null,
};

const setup = (props = {}) => {
  const cropTool = mount(<CropTool {...defaultProps} {...props} />);

  return {
    cropTool,
    selectedArea: cropTool.find(SelectedArea),
    button: cropTool.find('button'),
  };
};

describe('components', () => {
  describe('ImageEditor', () => {
    describe('CropTool', () => {
      it('should render with a default state', () => {
        const { cropTool } = setup();
        expect(cropTool.state()).toEqual({
          landscape: true,
          isMoving: false,
          isResizing: false,
          resizeVertical: false,
          x0: 0,
          y0: 0,
          x1: 0,
          y1: 0,
          xM: 0,
          yM: 0,
        });
      });

      it('should render a SelectedArea', () => {
        const { selectedArea } = setup();

        expect(selectedArea).toHaveLength(1);
      });

      it('should render two buttons', () => {
        const { button } = setup();

        expect(button).toHaveLength(2);
        expect(button.first().text()).toBe('Cancel');
        expect(button.last().text()).toBe('Save image');
      });

      it('should cancel render when Cancel button is clicked', () => {
        const onCancelEdition = jest.fn();
        const { button } = setup({ onCancelEdition });

        const cancelButton = button.first();

        cancelButton.simulate('click');

        expect(onCancelEdition).toHaveBeenCalled();
      });

      it('should save the edition render when Save button is clicked', () => {
        const onSaveEdition = jest.fn();
        const { cropTool, button } = setup({ onSaveEdition });

        const saveButton = button.last();

        saveButton.simulate('click');

        const { x0, y0, x1, y1 } = cropTool.state();
        expect(onSaveEdition).toHaveBeenCalledWith(cropTool.instance().image, { x0, y0, x1, y1 });
      });

      it('should start moving when startMove is called', () => {
        const { cropTool } = setup();
        const event = {
          preventDefault: () => null,
        };
        cropTool.instance().startMove(event);
        expect(cropTool.state('isMoving')).toBeTruthy();
      });

      it('should only interact to mouse movement is the state isMoving or isResizing', () => {
        const { cropTool } = setup();
        const event = {
          preventDefault: () => null,
        };
        const cropToolInstance = cropTool.instance();
        const handleMoveSpy = jest.spyOn(cropToolInstance, 'handleMove');
        const handleReiszeSpy = jest.spyOn(cropToolInstance, 'handleResize');

        cropToolInstance.onMouseMove(event);

        expect(handleMoveSpy).not.toHaveBeenCalled();
        expect(handleReiszeSpy).not.toHaveBeenCalled();

        cropTool.setState({ isMoving: true });
        cropToolInstance.onMouseMove(event);

        expect(handleMoveSpy).toHaveBeenCalledTimes(1);
        expect(handleReiszeSpy).not.toHaveBeenCalled();

        cropTool.setState({ isMoving: false, isResizing: true });
        cropToolInstance.onMouseMove(event);

        expect(handleMoveSpy).toHaveBeenCalledTimes(1);
        expect(handleReiszeSpy).toHaveBeenCalledTimes(1);
      });

      it('should unset isMoving and isResizing and order the selected area points when mouseup', () => {
        const { cropTool } = setup();

        const prevState = {
          landscape: true,
          isMoving: false,
          isResizing: true,
          isResizingSide: true,
          resizeVertical: true,
          x0: 50,
          y0: 50,
          x1: 10,
          y1: 10,
          xM: 10,
          yM: 10,
        };
        cropTool.setState(prevState);

        const event = {
          preventDefault: () => null,
        };

        cropTool.instance().onMouseUp(event);

        expect(cropTool.state()).toEqual({
          ...prevState,
          isMoving: false,
          isResizing: false,
          isResizingSide: false,
          resizeVertical: false,
          x0: 10,
          y0: 10,
          x1: 50,
          y1: 50,
          xM: 0,
          yM: 0,
        });
      });

      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <CropTool {...defaultProps} />
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
