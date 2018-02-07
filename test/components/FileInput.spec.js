import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';

import Droparea from '../../src/components/Droparea';
import FileInput from '../../src/components/FileInput';

const defaultProps = {
  label: 'Test',
};

const setup = (props = {}) => {
  const fileInput = mount(<FileInput {...defaultProps} {...props} />);

  return {
    fileInput,
    label: fileInput.find('.brainhub-file-input__label'),
    input: fileInput.find('input[type="file"]'),
    droparea: fileInput.find(Droparea),
  };
};

const CustomComponent = ({ name, size }) => <div>{name}:{size}</div>;
CustomComponent.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
};

describe('components', () => {
  describe('FileInput', () => {
    const data = {
      name: 'Cute puppies',
      size: 1000,
    };

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
      expect(input.hasClass('brainhub-file-input__input--hidden')).toBeTruthy();
    });

    it('should render a label', () => {
      const { label } = setup();

      expect(label).toHaveLength(1);
      expect(label.text()).toBe(defaultProps.label);
    });

    it('should render a droparea', () => {
      const { droparea } = setup();

      expect(droparea).toHaveLength(1);
    });

    it('should render a droparea that can open the file dialog', () => {
      const { droparea, input } = setup();

      const inputClickSpy = jest.spyOn(input.instance(), 'click');

      droparea.prop('openFileDialog')();

      expect(inputClickSpy).toHaveBeenCalled();
    });

    it('should call onDragEnter callback when drag enters for first time', () => {
      const onDragEnterCallback = jest.fn();
      const { droparea, fileInput } = setup({ onDragEnterCallback });

      droparea.simulate('dragenter');

      expect(onDragEnterCallback).toHaveBeenCalledWith(fileInput.state());

      onDragEnterCallback.mockClear();
      droparea.simulate('dragenter');

      expect(onDragEnterCallback).not.toHaveBeenCalled();
    });

    it('should decreate `isOver` state when drag leaves', () => {
      const { droparea, fileInput } = setup();

      const state = fileInput.state();

      droparea.simulate('dragLeave');

      expect(fileInput.state()).toEqual({
        ...state,
        isOver: state.isOver - 1,
      });
    });

    it('should call onDragLeaves callback when drag leaves for last time', () => {
      const onDragLeaveCallback = jest.fn();
      const { droparea, fileInput } = setup({ onDragLeaveCallback });

      fileInput.setState({ isOver: 1 });
      droparea.simulate('dragLeave');

      expect(onDragLeaveCallback).toHaveBeenCalledWith(fileInput.state());

      onDragLeaveCallback.mockClear();
      droparea.simulate('dragLeave');

      expect(onDragLeaveCallback).not.toHaveBeenCalled();
    });

    it('should store the drop file in the state, and reset the rest, and call the callback', () => {
      const onDropCallback = jest.fn();
      const { droparea, fileInput } = setup({ onDropCallback });

      const file = { filename: 'MockFile' };
      fileInput.setState({ isOver: 2, enteredInDocument: 2 });

      droparea.simulate('drop', { dataTransfer: { files: [file] } });

      expect(fileInput.state('enteredInDocument')).toBe(0);
      expect(fileInput.state('isOver')).toBe(0);
      expect(fileInput.state('value')).toBe(file);
      expect(onDropCallback).toHaveBeenCalledWith(fileInput.state());
    });

    it('should render metadata from default component', () => {
      const { fileInput } = setup();
      fileInput.setState({ value: data });

      expect(fileInput.find('FileInputMetadata')).toHaveLength(1);
    });

    it('should render metadata from custom component', () => {
      const { fileInput } = setup({ customMetadata: CustomComponent });
      fileInput.setState({ value: data });

      expect(fileInput.find(CustomComponent)).toBeTruthy();
    });

    it('should not render metadata when user pass false to displayMetadata prop', () => {
      const { fileInput } = setup({ displayMetadata: false });
      fileInput.setState({ value: data });

      expect(fileInput.find('FileInputMetadata').length).toEqual(0);
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
