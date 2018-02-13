import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ImageEditor from '../../../src/components/ImageEditor';
import SelectedArea from '../../../src/components/ImageEditor/SelectedArea';
import CanvasPrinter from '../../../src/components/ImageEditor/CanvasPrinter';

const defaultProps = {
  image: '',
  onCancelEdition: () => null,
  onEdition: () => null,
};

const setup = (props = {}) => {
  const imageEditor = mount(<ImageEditor {...defaultProps} {...props} />);

  return {
    imageEditor,
    selectedArea: imageEditor.find(SelectedArea),
    canvasPrinter: imageEditor.find(CanvasPrinter),
    button: imageEditor.find('button'),
  };
};

describe('components', () => {
  describe('ImageEditor', () => {
    it('should render with a default state', () => {
      const { imageEditor } = setup();
      expect(imageEditor.state()).toEqual({
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

    it('should render a CanvasPrinter', () => {
      const { canvasPrinter } = setup();

      expect(canvasPrinter).toHaveLength(1);
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

    it('should start moving when startMove is called', () => {
      const { imageEditor } = setup();
      const event = {
        preventDefault: () => null,
      };
      imageEditor.instance().startMove(event);
      expect(imageEditor.state('isMoving')).toBeTruthy();
    });

    it('should only interact to mouse movement is the state isMoving or isResizing', () => {
      const { imageEditor } = setup();
      const event = {
        preventDefault: () => null,
      };
      const imageEditorInstance = imageEditor.instance();
      const handleMoveSpy = jest.spyOn(imageEditorInstance, 'handleMove');
      const handleReiszeSpy = jest.spyOn(imageEditorInstance, 'handleResize');

      imageEditorInstance.onMouseMove(event);

      expect(handleMoveSpy).not.toHaveBeenCalled();
      expect(handleReiszeSpy).not.toHaveBeenCalled();

      imageEditor.setState({ isMoving: true });
      imageEditorInstance.onMouseMove(event);

      expect(handleMoveSpy).toHaveBeenCalledTimes(1);
      expect(handleReiszeSpy).not.toHaveBeenCalled();

      imageEditor.setState({ isMoving: false, isResizing: true });
      imageEditorInstance.onMouseMove(event);

      expect(handleMoveSpy).toHaveBeenCalledTimes(1);
      expect(handleReiszeSpy).toHaveBeenCalledTimes(1);
    });

    it('should unset isMoving and isResizing and order the selected area points when mouseup', () => {
      const { imageEditor } = setup();

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
      imageEditor.setState(prevState);

      const event = {
        preventDefault: () => null,
      };

      imageEditor.instance().onMouseUp(event);

      expect(imageEditor.state()).toEqual({
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
          <ImageEditor {...defaultProps} />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
