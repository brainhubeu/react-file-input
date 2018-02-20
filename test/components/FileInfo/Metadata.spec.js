import React from 'react';
import renderer from 'react-test-renderer';

import Metadata from '../../../src/components/FileInfo/Metadata';

describe('components', () => {
  describe('FileInfo', () => {
    describe('Thumbnail', () => {
      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <Metadata name="test" size={1000}/>
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
