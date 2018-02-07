import React from 'react';
import renderer from 'react-test-renderer';

import ImageThumbnail from '../../src/components/ImageThumbnail';

describe('ImageThumbnail', () => {
  it('should match exact snapshot', () => {
    const tree = renderer.create(
      <div>
        <ImageThumbnail image="image_source"/>
      </div>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
