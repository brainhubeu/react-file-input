import { move, resizeCorner, resizeSide } from '../../src/helpers/imageEdition';

describe('helpers', () => {
  describe('move', () => {
    it('should handle positive movement', () => {
      const click = { pointX: 30, pointY: 50 };
      const size = { height: 200, width: 100 };
      const lastPoints = { xM: 20, yM: 30 };
      const points = { x0: 0, y0: 0, x1: 10, y1: 10 };

      const values = move(click, size, lastPoints, points);

      expect(values).toEqual({
        ...lastPoints,
        ...points,
        xM: click.pointX,
        yM: click.pointY,
        x0: points.x0 + click.pointX - lastPoints.xM,
        x1: points.x1 + click.pointX - lastPoints.xM,
        y0: points.y0 + click.pointY - lastPoints.yM,
        y1: points.y1 + click.pointY - lastPoints.yM,
      });
    });
    it('should handle positive movement that exceed boundaries', () => {
      const click = { pointX: 300, pointY: 500 };
      const size = { height: 200, width: 100 };
      const lastPoints = { xM: 20, yM: 30 };
      const points = { x0: 0, y0: 0, x1: 10, y1: 10 };

      const values = move(click, size, lastPoints, points);

      expect(values).toEqual({
        ...lastPoints,
        ...points,
        xM: size.width,
        yM: size.height,
        x0: points.x0 + size.width - lastPoints.xM,
        x1: points.x1 + size.width - lastPoints.xM,
        y0: points.y0 + size.height - lastPoints.yM,
        y1: points.y1 + size.height - lastPoints.yM,
      });
    });
    it('should handle negative movement', () => {
      const click = { pointX: 10, pointY: 10 };
      const size = { height: 200, width: 100 };
      const lastPoints = { xM: 20, yM: 30 };
      const points = { x0: 50, y0: 50, x1: 60, y1: 60 };

      const values = move(click, size, lastPoints, points);

      expect(values).toEqual({
        ...lastPoints,
        ...points,
        xM: click.pointX,
        yM: click.pointY,
        x0: points.x0 + click.pointX - lastPoints.xM,
        x1: points.x1 + click.pointX - lastPoints.xM,
        y0: points.y0 + click.pointY - lastPoints.yM,
        y1: points.y1 + click.pointY - lastPoints.yM,
      });
    });
    it('should handle positive movement that exceed boundaries', () => {
      const click = { pointX: -10, pointY: -10 };
      const size = { height: 200, width: 100 };
      const lastPoints = { xM: 20, yM: 30 };
      const points = { x0: 50, y0: 50, x1: 60, y1: 60 };

      const values = move(click, size, lastPoints, points);

      expect(values).toEqual({
        ...lastPoints,
        ...points,
        xM: 0,
        yM: 0,
        x0: points.x0 - lastPoints.xM,
        x1: points.x1 - lastPoints.xM,
        y0: points.y0 - lastPoints.yM,
        y1: points.y1 - lastPoints.yM,
      });
    });
  });
  describe('resizeCorner', () => {
    describe('without ratio', () => {
      it('should return the right point', () => {
        const click = { pointX: 0, pointY: 90 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeCorner(click, canvas, point, true);

        expect(values).toEqual({ x1: click.pointX, y1: click.pointY });
      });
    });
    describe('vertical movement with ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 0, pointY: 80 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeCorner(click, canvas, point, true, ratio);

        expect(values).toEqual({
          x1: point.x1 + ((click.pointY - point.y1) * ratio),
          y1: click.pointY,
        });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 0, pointY: 120 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeCorner(click, canvas, point, true, ratio);

        expect(values).toEqual({
          x1: point.x1 + ((canvas.height - point.y1) * ratio),
          y1: canvas.height,
        });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: 0, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeCorner(click, canvas, point, true, ratio);

        expect(values).toEqual({
          x1: point.x1 + ((0 - point.y1) * ratio),
          y1: 0,
        });
      });
      it('should return a valid area if points are inverted', () => {
        const click = { pointX: 0, pointY: 10 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 70, x1: 60, y1: 40 };
        const ratio = 1/3;
        const values = resizeCorner(click, canvas, point, true, ratio);

        expect(values).toEqual({
          x1: point.x1 - ((click.pointY - point.y1) * ratio),
          y1: click.pointY,
        });
      });
      it('should respect the horizontal dimensions', () => {
        const click = { pointX: 0, pointY: 90 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 185, y0: 0, x1: 195, y1: 30 };
        const ratio = 1/3;
        const values = resizeCorner(click, canvas, point, true, ratio);

        expect(values).toEqual({
          x1: canvas.width,
          y1: ((canvas.width - point.x1) / ratio) + point.y1,
        });
      });
    });
    describe('horizontal movement with ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 80, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeCorner(click, canvas, point, false, ratio);

        expect(values).toEqual({
          x1: click.pointX,
          y1: point.y1 + ((click.pointX - point.x1) / ratio),
        });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 120, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeCorner(click, canvas, point, false, ratio);

        expect(values).toEqual({
          x1: canvas.width,
          y1: point.y1 + ((canvas.width - point.x1) / ratio),
        });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: 0, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeCorner(click, canvas, point, false, ratio);

        values.y1 = Math.floor(values.y1 * 100) / 100;

        expect(values).toEqual({
          x1: 0,
          y1: point.y1 + (Math.floor(((0 - point.x1) / ratio) * 100) / 100),
        });
      });
      it('should return a valid area if points are inverted', () => {
        const click = { pointX: 10, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 70, y0: 50, x1: 40, y1: 60 };
        const ratio = 3;
        const values = resizeCorner(click, canvas, point, false, ratio);

        expect(values).toEqual({
          x1: click.pointX,
          y1: point.y1 - ((click.pointX - point.x1) / ratio),
        });
      });
      it('should respect the horizontal dimensions', () => {
        const click = { pointX: 90, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 0, y0: 185, x1: 30, y1: 195 };
        const ratio = 3;
        const values = resizeCorner(click, canvas, point, false, ratio);

        expect(values).toEqual({
          x1: ((canvas.height - point.y1) * ratio) + point.x1,
          y1: canvas.height,
        });
      });
    });
  });
  describe('resizeSide', () => {
    describe('vertical  without ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 0, pointY: 90 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, true);

        expect(values).toEqual({ ...point, y1: click.pointY });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 0, pointY: 120 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, true);

        expect(values).toEqual({ ...point, y1: canvas.height });
      });
      it('should return a valid area if the resize makes it change the sign', () => {
        const click = { pointX: 0, pointY: 10 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, true);

        expect(values).toEqual({ ...point, y1: click.pointY });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: 0, pointY: -10 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, true);

        expect(values).toEqual({ ...point, y1: 0 });
      });
    });
    describe('horizontal movement without ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 170, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, false);

        expect(values).toEqual({ ...point, x1: click.pointX });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 300, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, false);

        expect(values).toEqual({ ...point, x1: canvas.width });
      });
      it('should return a valid area if the resize makes it change the sign', () => {
        const click = { pointX: 10, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, false);

        expect(values).toEqual({ ...point, x1: click.pointX });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: -10, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 25, x1: 150, y1: 75 };
        const values = resizeSide(click, canvas, point, false);

        expect(values).toEqual({ ...point, x1: 0 });
      });
    });
    describe('vertical movement with ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 0, pointY: 80 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeSide(click, canvas, point, true, ratio);

        expect(values).toEqual({
          ...point,
          x0: point.x0 - ((click.pointY - point.y1) * ratio / 2),
          x1: point.x1 + ((click.pointY - point.y1) * ratio /2),
          y1: click.pointY,
        });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 0, pointY: 120 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeSide(click, canvas, point, true, ratio);

        expect(values).toEqual({
          ...point,
          x0: point.x0 - ((canvas.height - point.y1) * ratio/2),
          x1: point.x1 + ((canvas.height - point.y1) * ratio/2),
          y1: canvas.height,
        });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: 0, pointY: 0 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 20, x1: 60, y1: 50 };
        const ratio = 1/3;
        const values = resizeSide(click, canvas, point, true, ratio);

        expect(values).toEqual({
          ...point,
          x0: point.x0 - ((0 - point.y1) * ratio/2),
          x1: point.x1 + ((0 - point.y1) * ratio/2),
          y1: 0,
        });
      });
      it('should return a valid area if points are inverted', () => {
        const click = { pointX: 0, pointY: 10 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 50, y0: 70, x1: 60, y1: 40 };
        const ratio = 1/3;
        const values = resizeSide(click, canvas, point, true, ratio);

        expect(values).toEqual({
          ...point,
          x0: point.x0 + ((click.pointY - point.y1) * ratio / 2),
          x1: point.x1 - ((click.pointY - point.y1) * ratio / 2),
          y1: click.pointY,
        });
      });
      it('should respect the horizontal dimensions', () => {
        const click = { pointX: 0, pointY: 90 };
        const canvas = { height: 100, width: 200 };
        const point = { x0: 5, y0: 0, x1: 15, y1: 30 };
        const ratio = 1/3;
        const values = resizeSide(click, canvas, point, true, ratio);

        expect(values).toEqual({
          ...point,
          x0: 0,
          x1: point.x1 + point.x0,
          y1: (point.x0 * 2 / ratio) + point.y1,
        });
      });
    });
    describe('horizontal movement with ratio', () => {
      it('should return a valid area', () => {
        const click = { pointX: 80, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeSide(click, canvas, point, false, ratio);

        expect(values).toEqual({
          ...point,
          y0: point.y0 - ((click.pointX - point.x1) / ratio / 2),
          x1: click.pointX,
          y1: point.y1 + ((click.pointX - point.x1) / ratio / 2),
        });
      });
      it('should return a valid area if new point is outside the canvas', () => {
        const click = { pointX: 120, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeSide(click, canvas, point, false, ratio);

        expect(values).toEqual({
          ...point,
          y0: point.y0 - ((canvas.width - point.x1) / ratio / 2),
          x1: canvas.width,
          y1: point.y1 + ((canvas.width - point.x1) / ratio / 2),
        });
      });
      it('should return a valid area if the resize makes it change the sign and it is outside the canvas', () => {
        const click = { pointX: 0, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 20, y0: 50, x1: 50, y1: 60 };
        const ratio = 3;
        const values = resizeSide(click, canvas, point, false, ratio);

        expect(values).toEqual({
          ...point,
          y0: point.y0 - ((0 - point.x1) / ratio / 2),
          x1: 0,
          y1: point.y1 + ((0 - point.x1) / ratio / 2),
        });
      });
      it('should return a valid area if points are inverted', () => {
        const click = { pointX: 10, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 70, y0: 50, x1: 40, y1: 60 };
        const ratio = 3;
        const values = resizeSide(click, canvas, point, false, ratio);

        expect(values).toEqual({
          ...point,
          y0: point.y0 + ((click.pointX - point.x1) / ratio / 2),
          x1: click.pointX,
          y1: point.y1 - ((click.pointX - point.x1) / ratio / 2),
        });
      });
      it('should respect the horizontal dimensions', () => {
        const click = { pointX: 90, pointY: 0 };
        const canvas = { height: 200, width: 100 };
        const point = { x0: 0, y0: 5, x1: 30, y1: 15 };
        const ratio = 3;
        const values = resizeSide(click, canvas, point, false, ratio);

        expect(values).toEqual({
          ...point,
          y0: 0,
          x1: (point.y0 * 2 * ratio) + point.x1,
          y1: point.y1 + point.y0,
        });
      });
    });
  });
});
