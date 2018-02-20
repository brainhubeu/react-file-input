import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import faRedo from '@fortawesome/fontawesome-free-solid/faRedo';
import faUndo from '@fortawesome/fontawesome-free-solid/faUndo';

import ImageRotator from '../../../src/components/ImageEditor/ImageRotator';
import Icon from '../../../src/components/Icon';

const defaultProps = {
  image: 'testImage',
  onSave: () => null,
};

const setup = (props = {}) => {
  const imageRotator = shallow(<ImageRotator {...defaultProps} {...props} />);

  return {
    imageRotator,
    image: imageRotator.find('img'),
    buttons: imageRotator.find('button'),
  };
};

describe('components', () => {
  describe('ImageEditor', () => {
    describe('ImageRotator', () => {
      it('should mount with a default angle of 0', () => {
        const { imageRotator } = setup();

        expect(imageRotator.state()).toEqual({ angle: 0 });
      });

      it('should render the image passed as props', () => {
        const { image } = setup();

        expect(image).toHaveLength(1);
        expect(image.prop('src')).toBe(defaultProps.image);
      });

      it('should render the image rotated', () => {
        const { imageRotator } = setup();

        const angle = 2;

        imageRotator.setState({ angle });

        expect(imageRotator.find('img').prop('style')).toEqual({ transform: `rotate(${angle * 90}deg)` });
      });

      it('should render three buttons for control', () => {
        const { buttons } = setup();

        expect(buttons).toHaveLength(3);

        const first = buttons.first();

        const firstIcon = first.find(Icon);

        expect(firstIcon).toHaveLength(1);
        expect(firstIcon.prop('icon')).toBe(faUndo.icon);
        expect(first.hasClass('brainhub-image-rotator__button--arrow')).toBeTruthy();

        const middle = buttons.at(1);

        expect(middle.text()).toBe('Save image');
        expect(middle.hasClass('brainhub-image-rotator__button--save')).toBeTruthy();

        const last = buttons.last();

        const lastIcon = last.find(Icon);

        expect(lastIcon).toHaveLength(1);
        expect(lastIcon.prop('icon')).toBe(faRedo.icon);
        expect(first.hasClass('brainhub-image-rotator__button--arrow')).toBeTruthy();
      });

      it('should rotate counter clock-wise when user clicks on left arrow', () => {
        const { imageRotator, buttons } = setup();

        buttons.first().simulate('click');

        expect(imageRotator.state('angle')).toBe(3);
      });

      it('should save the rotation when user click on save', () => {
        const onSave = jest.fn();
        const { imageRotator, buttons } = setup({ onSave });

        buttons.at(1).simulate('click');

        expect(onSave).toHaveBeenCalledWith(imageRotator.instance().image, imageRotator.state('angle'));
      });

      it('should rotate clock-wise when user clicks on right arrow', () => {
        const { imageRotator, buttons } = setup();

        buttons.last().simulate('click');

        expect(imageRotator.state('angle')).toBe(1);
      });

      it('should match exact snapshot', () => {
        const tree = renderer.create(
          <div>
            <ImageRotator {...defaultProps} />
          </div>
        ).toJSON();

        expect(tree).toMatchSnapshot();
      });
    });
  });
});
