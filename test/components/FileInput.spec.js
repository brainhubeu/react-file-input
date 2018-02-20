import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import FileInput from '../../src/components/FileInput';

import DropArea from '../../src/components/DropArea';
import FileInfo from '../../src/components/FileInfo';
import ImageEditor from '../../src/components/ImageEditor';
import { getImageThumbnail } from '../../src/helpers/file';

jest.mock('../../src/helpers/file', () => ({
  getImageThumbnail: file => file.name,
}));

const file = new File(['test.spec.js'], 'Test.spec.js', { type: 'test/mock' });
file.filename = 'Test';
file.extension = 'spec.js';
file.mimeType = file.type;

const defaultProps = {
  label: 'Test',
};

const setup = (props = {}) => {
  const fileInput = mount(<FileInput {...defaultProps} {...props} />);

  return {
    fileInput,
    label: fileInput.find('.brainhub-file-input__label'),
    input: fileInput.find('input[type="file"]'),
    dropArea: fileInput.find(DropArea),
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
        tempValue: null,
        image: null,
      });
    });

    it('should render with custom class if defined', () => {
      const className = 'custom_class';
      const { fileInput } = setup({ className });

      expect(fileInput.find('div').first().hasClass(className)).toBeTruthy();
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

    it('should render a DropArea', () => {
      const { dropArea } = setup();

      expect(dropArea).toHaveLength(1);
    });

    it('should not render a DropArea an image is in edition', () => {
      const { fileInput } = setup();

      fileInput.setState({ value: null, image: 'imageSource' });

      expect(fileInput.find(DropArea)).toHaveLength(0);
    });

    it('should render a DropArea that can open the file dialog', () => {
      const { dropArea, input } = setup();

      const inputClickSpy = jest.spyOn(input.instance(), 'click');

      dropArea.prop('openFileDialog')();

      expect(inputClickSpy).toHaveBeenCalled();
    });

    it('should call onDragEnter callback when drag enters for first time', () => {
      const onDragEnterCallback = jest.fn();
      const { dropArea, fileInput } = setup({ onDragEnterCallback });

      dropArea.simulate('dragenter');

      expect(onDragEnterCallback).toHaveBeenCalledWith(fileInput.state());

      onDragEnterCallback.mockClear();
      dropArea.simulate('dragenter');

      expect(onDragEnterCallback).not.toHaveBeenCalled();
    });

    it('should decrease `isOver` state when drag leaves', () => {
      const { dropArea, fileInput } = setup();

      const state = fileInput.state();

      dropArea.simulate('dragLeave');

      expect(fileInput.state()).toEqual({
        ...state,
        isOver: state.isOver - 1,
      });
    });

    it('should call onDragLeaves callback when drag leaves for last time', () => {
      const onDragLeaveCallback = jest.fn();
      const { dropArea, fileInput } = setup({ onDragLeaveCallback });

      fileInput.setState({ isOver: 1 });
      dropArea.simulate('dragLeave');

      expect(onDragLeaveCallback).toHaveBeenCalledWith(fileInput.state());

      onDragLeaveCallback.mockClear();
      dropArea.simulate('dragLeave');

      expect(onDragLeaveCallback).not.toHaveBeenCalled();
    });

    it('should store the drop file in the state, and reset the rest, and call the callback', () => {
      const onDropCallback = jest.fn();
      const { dropArea, fileInput } = setup({ onDropCallback });

      fileInput.setState({ isOver: 2, enteredInDocument: 2 });

      dropArea.simulate('drop', { dataTransfer: { files: [file] } });

      expect(fileInput.state('enteredInDocument')).toBe(0);
      expect(fileInput.state('isOver')).toBe(0);
      expect(fileInput.state('value')).toBe(file);
    });

    it('should render metadata if the file is set', () => {
      const { fileInput } = setup();
      fileInput.setState({ value: file });

      expect(fileInput.find(FileInfo)).toHaveLength(1);
    });

    it('should handle file images with an image editor', () => {
      const { fileInput } = setup({ displayImageThumbnail: false });
      fileInput.setState({ value: file, image: 'test' });

      expect(fileInput.find('ImageThumbnail').length).toEqual(0);
    });

    it('should handle image files with the file editor', async() => {
      const { dropArea, fileInput } = setup();

      const imageFile = new File(['imageFile'], 'MockFile.jpeg', { type: 'image/jpg' });
      fileInput.setState({ isOver: 2, enteredInDocument: 2 });

      await dropArea.simulate('drop', { dataTransfer: { files: [imageFile] } });

      expect(fileInput.state('enteredInDocument')).toBe(0);
      expect(fileInput.state('isOver')).toBe(0);
      expect(fileInput.state('value')).toBe(null);
      expect(fileInput.state('tempValue')).toBe(imageFile);
      expect(fileInput.state('image')).toBe(getImageThumbnail(imageFile));
    });

    it('should render an ImageEditor if it is handling an image file', () => {
      const { fileInput } = setup( );

      fileInput.setState({ image: 'testImage' });

      expect(fileInput.find(ImageEditor)).toHaveLength(1);
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
