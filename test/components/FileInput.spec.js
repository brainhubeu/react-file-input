import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import FileInput from '../../src/components/FileInput';

const defaultProps = {};

const setup = (props = {}) => {
  const fileInput = mount(<FileInput {...defaultProps} {...props} />);


  return {
    fileInput,
    div: fileInput.find('div'),
    input: fileInput.find('input'),
    button: fileInput.find('button'),
  };
};

describe('components', () => {
  describe('FileInput', () => {
    it('should render with a default state', () => {
      const { fileInput } = setup();

      expect(fileInput.state()).toEqual({
        enteredInDocument: 0,
        isOver: 0,
        value: null,
      });
    });

    it('should render a hidden file input', () => {
      const { input } = setup();
      expect(input).toHaveLength(1);
      expect(input.prop('type')).toBe('file');
      expect(input.hasClass('BrainhubFileInput__input--hidden')).toBeTruthy();
    });

    it('should render a button to select files', () => {
      const { input, button } = setup();

      const inputClickSpy = jest.spyOn(input.instance(), 'click');

      expect(button).toHaveLength(1);
      expect(button.text()).toBe('Select File');

      button.simulate('click');

      expect(inputClickSpy).toHaveBeenCalled();
      expect(input.hasClass('BrainhubFileInput__input--hidden')).toBeTruthy();
    });

    it('should render a `drop here` message when files are dragging', () => {
      const { fileInput, div } = setup();

      expect(div.last().hasClass('BrainhubFileInput__dropInfo--hidden')).toBeTruthy();
      expect(div.last().find('p').text()).toBe('Drop here to select file');

      fileInput.setState({ enteredInDocument: 1, isOver: 1 });

      expect(fileInput.find('div').last().hasClass('BrainhubFileInput__dropInfo--hidden')).toBeFalsy();
    });

    it('should increase `isOver` state when drag enters', () => {
      const { fileInput } = setup();

      const state = fileInput.state();

      fileInput.simulate('dragenter');

      expect(fileInput.state()).toEqual({
        ...state,
        isOver: state.isOver + 1,
      });
    });

    it('should call onDragEnter callback when drag enters for first time', () => {
      const onDragEnterCallback = jest.fn();
      const { fileInput } = setup({ onDragEnterCallback });

      fileInput.simulate('dragenter');

      expect(onDragEnterCallback).toHaveBeenCalledWith(fileInput.state());

      onDragEnterCallback.mockClear();
      fileInput.simulate('dragenter');

      expect(onDragEnterCallback).not.toHaveBeenCalled();
    });

    it('should decreate `isOver` state when drag leaves', () => {
      const { fileInput } = setup();

      const state = fileInput.state();

      fileInput.simulate('dragLeave');

      expect(fileInput.state()).toEqual({
        ...state,
        isOver: state.isOver - 1,
      });
    });

    it('should call onDragLeaves callback when drag leaves for last time', () => {
      const onDragLeaveCallback = jest.fn();
      const { fileInput } = setup({ onDragLeaveCallback });

      fileInput.setState({ isOver: 1 });
      fileInput.simulate('dragLeave');

      expect(onDragLeaveCallback).toHaveBeenCalledWith(fileInput.state());

      onDragLeaveCallback.mockClear();
      fileInput.simulate('dragLeave');

      expect(onDragLeaveCallback).not.toHaveBeenCalled();
    });

    it('should store the drop file in the state, and reset the rest, and call the callback', () => {
      const onDropCallback = jest.fn();
      const { fileInput } = setup({ onDropCallback });

      const file = { filename: 'MockFile' };
      fileInput.setState({ isOver: 2, enteredInDocument: 2 });

      fileInput.simulate('drop', { dataTransfer: { files: [file] } });

      expect(fileInput.state()).toEqual({
        enteredInDocument: 0,
        isOver: 0,
        value: file,
      });
      expect(onDropCallback).toHaveBeenCalledWith(fileInput.state());
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
