import { inRange, minPositive, safeDivision } from './math';

export const move = ({ pointX, pointY }, { height, width }, { xM, yM }, { x0, y0, x1, y1 }) => {
  const clickX = minPositive(pointX, width);
  const clickY = minPositive(pointY, height);

  const dX = clickX - xM;
  const dY = clickY - yM;

  // processX
  const realDX = dX > 0
    ? Math.min(dX, width - x1)
    : Math.max(dX, -x0);

  const realDY = dY > 0
    ? Math.min(dY, height - y1)
    : Math.max(dY, -y0);

  return {
    xM: clickX,
    yM: clickY,
    x0: x0 + realDX,
    y0: y0 + realDY,
    x1: x1 + realDX,
    y1: y1 + realDY,
  };
};

export const resizeCorner = ({ pointX, pointY }, { height, width }, { x0, y0, x1, y1 }, vertical, ratio = 0) => {
  const x = minPositive(pointX, width);
  const y = minPositive(pointY, height);


  if (!ratio) {
    return {
      x1: x,
      y1: y,
    };
  }

  const resizeFactor = ((x0 > x1 && y0 < y1) || (y0 > y1 && x0 < x1)) ? -1 : 1;

  const point = {
    x1: vertical ? x0 + (resizeFactor * (y - y0) * ratio) : x,
    y1: vertical ? y : y0 + safeDivision(resizeFactor * (x - x0), ratio, 0),
  };

  if (point.x1 > width || point.y1 > height) {
    return {
      x1: vertical ? width : x0 + (resizeFactor * (height - y0) * ratio),
      y1: vertical ? + y0 + safeDivision(resizeFactor * (width - x0), ratio, 0 ) : height,
    };
  }

  if (point.x1 < 0 || point.y1 < 0) {
    return {
      x1: vertical ? 0 : x0 - (resizeFactor * y0 * ratio),
      y1: vertical ? y0 - safeDivision(resizeFactor * x0, ratio, 0) : 0,
    };
  }

  return point;
};

export const resizeSide = ({ pointX, pointY }, { height, width }, { x0, y0, x1, y1 }, vertical, ratio = 0) => {
  // Calculates the real posible point (i.e point tha falls between image boundaries)
  const x = minPositive(pointX, width);
  const y = minPositive(pointY, height);

  const resizeFactor = ((x0 > x1 && y0 < y1) || (y0 > y1 && x0 < x1)) ? -1 : 1;

  const points = {
    x0: vertical ? x0 - (resizeFactor * (y -y1) * ratio / 2) : x0,
    y0: vertical ? y0 : y0 - safeDivision(resizeFactor * (x - x1) / 2, ratio, 0),
    x1: vertical ? x1 + (resizeFactor * (y - y1) * ratio / 2) : x,
    y1: vertical ? y : y1 + safeDivision(resizeFactor * (x - x1) / 2, ratio, 0),
  };

  if (inRange(points.x0, width)
    && inRange(points.y0, height)
    && inRange(points.x1, width)
    && inRange(points.y1, height)) {
    return points;
  }

  const adjustFactor = vertical ? Math.sign(x1 - x0) : Math.sign(y1 - y0);

  const maxDY = Math.max(Math.min(height - y0, y1, y0, height - y1), 0);
  const maxDX = Math.max(Math.min(width - x0, x1, x0, width - x1), 0);

  return {
    x0: vertical
      ? x0 - (adjustFactor * maxDX)
      : points.x0,
    y0: vertical
      ? points.y0
      : y0 - (adjustFactor * maxDY),
    x1: vertical
      ? x1 + (adjustFactor * maxDX)
      : x1 + (adjustFactor * resizeFactor * maxDY * 2 * ratio),
    y1: vertical
      ? y1 + (adjustFactor * resizeFactor * maxDX * 2 /ratio)
      : y1 + (adjustFactor * maxDY),
  };
};
