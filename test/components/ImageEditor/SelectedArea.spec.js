import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import SelectedArea from '../../../src/components/ImageEditor/SelectedArea';

const defaultProps = {
  startMove: () => null,
  startResize: () => null,
};

const setup = (props = {}) => {
  const selectedArea = mount(<SelectedArea {...defaultProps} {...props} />);

  return {
    selectedArea,
    points: selectedArea.find('div.brainhub-selected-area__resize-point'),
  };
};

describe('components', () => {
  describe('ImageEditor', () => {
    describe('SelectedArea', () => {
      it('should render all the resize points', () => {
        const { points } = setup();

        expect(points).toHaveLength(8);
      });

      it('should render with the reight size', () => {
        const style = { top: '10%', bottom: '50%', right: '20%', left: '30%' };
        const { selectedArea } = setup({ style });

        expect(selectedArea.find('div').first().prop('style')).toEqual(style);
      });

      it('should start moving if user clicks on the selectedArea', () => {
        const startMove = jest.fn();
        const { selectedArea } = setup({ startMove });
        selectedArea.simulate('mousedown', { target: selectedArea.find('div').first().instance() });

        expect(startMove).toHaveBeenCalled();
      });

      it('should start resizing if user clicks on the points', () => {
        const startMove = jest.fn();
        const startResize = jest.fn();
        const { points } = setup({ startMove, startResize });

        points.first().simulate('mousedown');

        expect(startMove).not.toHaveBeenCalled();
        expect(startResize).toHaveBeenCalled();
      });

      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <SelectedArea {...defaultProps} />
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
