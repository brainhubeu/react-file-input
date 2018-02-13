import React from 'react';
import renderer from 'react-test-renderer';

import CanvasPrinter from '../../../src/components/ImageEditor/CanvasPrinter';

const defaultProps = {
  onCanvasDraw: () => null,
};

describe('components', () => {
  describe('ImageEditor', () => {
    describe('CanvasPrinter', () => {
      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <CanvasPrinter {...defaultProps} />
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
