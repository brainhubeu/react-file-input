/* eslint-disable react/jsx-no-bind, react/prop-types */
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FileInfo from '../../../src/components/FileInfo';
import Metadata from '../../../src/components/FileInfo/Metadata';
import Thumbnail from '../../../src/components/FileInfo/Thumbnail';

const metadataComponent = () => (<div className="customMetadata" />);
const thumbnailComponent = ({ children }) => (<div className="customThumbnail">{children}</div>);

const file = new File(['test.spec.js'], 'Test.spec.js', { type: 'test/mock' });
file.filename = 'Test';
file.extension = 'spec.js';
file.mimeType = file.type;

const defaultProps = {
  file,
};

const setup = (props = {}) => {
  const fileInfo = shallow(<FileInfo {...defaultProps} {...props} />);

  return {
    fileInfo,
  };
};

describe('components', () => {
  describe('FileInfo', () => {
    it('should render only a Metadata component', () => {
      const { fileInfo } = setup();

      expect(fileInfo.find(Metadata)).toHaveLength(1);
      expect(fileInfo.find(Thumbnail)).toHaveLength(0);
    });
    it('should render a Thumbnail if image is present', () => {
      const { fileInfo } = setup({ image: 'imageSource' });

      expect(fileInfo.find(Metadata)).toHaveLength(1);
      expect(fileInfo.find(Thumbnail)).toHaveLength(1);
    });
    it('should render a Thumbnail if image is present', () => {
      const { fileInfo } = setup({ image: 'imageSource', metadataComponent, thumbnailComponent });

      expect(fileInfo.find(metadataComponent)).toHaveLength(1);
      expect(fileInfo.find(thumbnailComponent)).toHaveLength(1);
      expect(fileInfo.find(Metadata)).toHaveLength(0);
      expect(fileInfo.find(Thumbnail)).toHaveLength(0);
    });
    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <FileInfo {...defaultProps}/>
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should render with custom class if defined', () => {
      const className = 'custom_class';
      const { fileInfo } = setup({ className });

      expect(fileInfo.hasClass(className)).toBeTruthy();
      expect(fileInfo.hasClass('brainhub-file-info')).toBeTruthy();
    });

    it('should match exact snapshot with custom components', () => {
      const tree = renderer.create(
        <div>
          <FileInfo
            {...defaultProps}
            image="testImage"
            metadataComponent={metadataComponent}
            thumbnailComponent={thumbnailComponent}
          />
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
