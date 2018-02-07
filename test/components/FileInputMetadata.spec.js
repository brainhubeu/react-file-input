import React from 'react';
import renderer from 'react-test-renderer';

import FileInputMetadata from '../../src/components/FileInputMetadata';

describe('components', () => {
  describe('FileInputMetadata', () => {
    it('should match exact snapshot', () => {
      const tree = renderer.create(
        <div>
          <FileInputMetadata name="test" size={1000}/>
        </div>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
