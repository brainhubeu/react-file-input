import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ImageEditor from '../../../src/components/ImageEditor';
import CanvasPrinter from '../../../src/components/ImageEditor/CanvasPrinter';
import CropTool from '../../../src/components/ImageEditor/CropTool';
import ImageRotator from '../../../src/components/ImageEditor/ImageRotator';

const defaultProps = {
  image: 'testImage',
  onEditionFinished: () => null,
};

const setup = (props = {}) => {
  const imageEditor = mount(<ImageEditor {...defaultProps} {...props} />);

  return {
    imageEditor,
    canvasPrinter: imageEditor.find(CanvasPrinter),
  };
};

describe('components', () => {
  describe('ImageEditor', () => {
    it('should render with a default state', () => {
      const { imageEditor } = setup();
      expect(imageEditor.state()).toEqual({
        image: defaultProps.image,
        imageBlob: null,
        hasBeenRotated: false,
        hasBeenCropped: false,
      });
    });
    it('should render a CanvasPrinter', () => {
      const { canvasPrinter } = setup();

      expect(canvasPrinter).toHaveLength(1);
    });
    it('should render an ImageRotator as first step', () => {
      const { imageEditor } = setup();

      expect(imageEditor.find(ImageRotator)).toHaveLength(1);
    });

    it('should render a CropTool if the image has already been rotated', () => {
      const { imageEditor } = setup({ cropTool: true });

      imageEditor.setState({ hasBeenRotated: true });

      expect(imageEditor.find(ImageRotator)).toHaveLength(0);
      expect(imageEditor.find(CropTool)).toHaveLength(1);
    });

    it('should finish edition if the image is rotated if there is no more steps', async () => {
      const onEditionFinished = jest.fn();
      const { imageEditor } = setup({ onEditionFinished });

      const image = 'test image';
      const angle = '1';
      const imageBlob = new Blob([]);
      const canvasPrinterMock = {
        rotateImage: jest.fn(() => Promise.resolve(imageBlob)),
      };

      imageEditor.instance().canvasPrinter = canvasPrinterMock;

      await imageEditor.find(ImageRotator).prop('onSave')(image, angle);

      expect(canvasPrinterMock.rotateImage).toHaveBeenCalledWith(image, angle);
      expect(imageEditor.state('imageBlob')).toBe(imageBlob);
      expect(imageEditor.state('hasBeenRotated')).toBeTruthy();
      expect(onEditionFinished).toHaveBeenCalledWith(imageBlob);
    });

    it('should finish edition if the image is rotated and scaled if there is no more steps', async () => {
      const onEditionFinished = jest.fn();
      const scaleOptions = { width: 500, height: 500, keepAspectRatio: true };
      const { imageEditor } = setup({ scaleOptions, onEditionFinished });

      const image = 'test image';
      const angle = '1';
      const imageBlob = new Blob([]);
      const canvasPrinterMock = {
        rotateAndScaleImage: jest.fn(() => Promise.resolve(imageBlob)),
      };

      imageEditor.instance().canvasPrinter = canvasPrinterMock;

      await imageEditor.find(ImageRotator).prop('onSave')(image, angle);

      expect(canvasPrinterMock.rotateAndScaleImage).toHaveBeenCalledWith(image, angle, scaleOptions);
      expect(imageEditor.state('imageBlob')).toBe(imageBlob);
      expect(imageEditor.state('hasBeenRotated')).toBeTruthy();
      expect(onEditionFinished).toHaveBeenCalledWith(imageBlob);
    });

    it('should not finish edition after rotation step if cropTool option is enabled', async () => {
      const onEditionFinished = jest.fn();
      const { imageEditor } = setup({ cropTool: true, onEditionFinished });

      const image = 'test image';
      const angle = '1';
      const imageBlob = new Blob([]);
      const canvasPrinterMock = {
        rotateImage: jest.fn(() => Promise.resolve(imageBlob)),
      };

      imageEditor.instance().canvasPrinter = canvasPrinterMock;

      await imageEditor.find(ImageRotator).prop('onSave')(image, angle);

      expect(canvasPrinterMock.rotateImage).toHaveBeenCalledWith(image, angle);
      expect(imageEditor.state('imageBlob')).toBe(imageBlob);
      expect(imageEditor.state('hasBeenRotated')).toBeTruthy();
      expect(onEditionFinished).not.toHaveBeenCalled();
    });

    it('should finish edition if the image crop is canceled', async () => {
      const onEditionFinished = jest.fn();
      const { imageEditor } = setup({ cropTool: true, onEditionFinished });

      const imageBlob = new Blob([]);

      imageEditor.setState({ imageBlob, hasBeenRotated: true });

      await imageEditor.find(CropTool).prop('onCancelEdition')();

      expect(imageEditor.state('hasBeenCropped')).toBeTruthy();
      expect(onEditionFinished).toHaveBeenCalledWith(imageBlob);
    });

    it('should scale and finish edition if the image crop is canceled and there is scale options', async () => {
      const onEditionFinished = jest.fn();
      const scaleOptions = { width: 500, height: 500, keepAspectRatio: true };
      const { imageEditor } = setup({ cropTool: true, scaleOptions, onEditionFinished });

      const imageBlob = new Blob([]);

      const image = 'test image';

      const canvasPrinterMock = {
        resizeImage: jest.fn(() => Promise.resolve(imageBlob)),
      };

      imageEditor.setState({ hasBeenRotated: true });
      imageEditor.instance().canvasPrinter = canvasPrinterMock;

      await imageEditor.find(CropTool).prop('onCancelEdition')(image);

      expect(imageEditor.state('hasBeenCropped')).toBeTruthy();
      expect(onEditionFinished).toHaveBeenCalledWith(imageBlob);
    });

    it('should scale and finish edition if the image crop is canceled and there is scale options', async () => {
      const onEditionFinished = jest.fn();
      const scaleOptions = { width: 500, height: 500, keepAspectRatio: true };
      const { imageEditor } = setup({ cropTool: true, scaleOptions, onEditionFinished });

      const imageBlob = new Blob([]);

      const image = 'test image';
      const area = { x0: 0, x1: 0, y0: 0, y1: 0 };
      const canvasPrinterMock = {
        cropAndResizeImage: jest.fn(() => Promise.resolve(imageBlob)),
      };

      imageEditor.setState({ hasBeenRotated: true });
      imageEditor.instance().canvasPrinter = canvasPrinterMock;

      await imageEditor.find(CropTool).prop('onSaveEdition')(image, area);

      expect(imageEditor.state('hasBeenCropped')).toBeTruthy();
      expect(onEditionFinished).toHaveBeenCalledWith(imageBlob);
    });

    it('should render with custom class if defined', () => {
      const className = 'custom_class';
      const { imageEditor } = setup({ className });

      expect(imageEditor.hasClass(className)).toBeTruthy();
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
