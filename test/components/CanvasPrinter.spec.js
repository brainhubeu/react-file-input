import React from 'react';
import renderer from 'react-test-renderer';

import CanvasPrinter from '../../src/components/CanvasPrinter';

describe('CanvasPrinter', () => {
  it('should match exact snapshot', () => {
    const tree = renderer.create(
      <div>
        <CanvasPrinter/>
      </div>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
