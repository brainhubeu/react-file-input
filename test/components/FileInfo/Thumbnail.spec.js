import React from 'react';
import renderer from 'react-test-renderer';

import Thumbnail from '../../../src/components/FileInfo/Thumbnail';

describe('components', () => {
  describe('FileInfo', () => {
    describe('Thumbnail', () => {
      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <Thumbnail>
              <img src="imageSource"/>
            </Thumbnail>
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
