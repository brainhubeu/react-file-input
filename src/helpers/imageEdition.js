import { inRange, minPositive, safeDivision } from './math';

export const move = ({ pointX, pointY }, { height, width }, { xM, yM }, { x0, y0, x1, y1 }) => {
  // Find the possible points between image margins
  const clickX = minPositive(pointX, width);
  const clickY = minPositive(pointY, height);

  // Find diference respect last mouse position
  const dX = clickX - xM;
  const dY = clickY - yM;

  // Find final point that falls in image margins
  const realDX = dX > 0
    ? Math.min(dX, width - x1)
    : Math.max(dX, -x0);
  const realDY = dY > 0
    ? Math.min(dY, height - y1)
    : Math.max(dY, -y0);

  // Return updated selection area point and last mouse position
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
  // Find the possible points between image margins
  const x = minPositive(pointX, width);
  const y = minPositive(pointY, height);

  // If there is no ratio any point inside the image is good
  if (!ratio) {
    return {
      x1: x,
      y1: y,
    };
  }

  // Depends on which diagonal is being drag during the resize
  const resizeFactor = ((x0 > x1 && y0 < y1) || (y0 > y1 && x0 < x1)) ? -1 : 1;

  const point = {
    x1: vertical ? x0 + (resizeFactor * (y - y0) * ratio) : x,
    y1: vertical ? y : y0 + safeDivision(resizeFactor * (x - x0), ratio, 0),
  };

  // If points are not in range means that secondary axis is outside the image boundaries.
  // Find new points for the maximum value allowed in the secondary axis
  if (point.x1 > width || point.y1 > height) {
    return {
      x1: vertical ? width : x0 + (resizeFactor * (height - y0) * ratio),
      y1: vertical ? + y0 + safeDivision(resizeFactor * (width - x0), ratio, 0 ) : height,
    };
  }

  // If points are not in range means that secondary axis is outside the image boundaries.
  // Find new points for the minimum value allowed in the secondary axis (always 0)
  if (point.x1 < 0 || point.y1 < 0) {
    return {
      x1: vertical ? 0 : x0 - (resizeFactor * y0 * ratio),
      y1: vertical ? y0 - safeDivision(resizeFactor * x0, ratio, 0) : 0,
    };
  }

  return point;
};

export const resizeSide = ({ pointX, pointY }, { height, width }, { x0, y0, x1, y1 }, vertical, ratio = 0) => {
  const x = minPositive(pointX, width);
  const y = minPositive(pointY, height);

  // Depends on which diagonal is being drag during the resize
  const resizeFactor = ((x0 > x1 && y0 < y1) || (y0 > y1 && x0 < x1)) ? -1 : 1;

  const points = {
    x0: vertical ? x0 - (resizeFactor * (y -y1) * ratio / 2) : x0,
    y0: vertical ? y0 : y0 - safeDivision(resizeFactor * (x - x1) / 2, ratio, 0),
    x1: vertical ? x1 + (resizeFactor * (y - y1) * ratio / 2) : x,
    y1: vertical ? y : y1 + safeDivision(resizeFactor * (x - x1) / 2, ratio, 0),
  };

  // If all the points are inside the image, return the points
  if (inRange(points.x0, width)
    && inRange(points.y0, height)
    && inRange(points.x1, width)
    && inRange(points.y1, height)) {
    return points;
  }

  // Negative if the point order has been inverted
  const adjustFactor = vertical ? Math.sign(x1 - x0) : Math.sign(y1 - y0);

  // Find maximum resize for the secondary axis inside the image boundaries
  const maxDY = minPositive(height - y0, y1, y0, height - y1);
  const maxDX = minPositive(width - x0, x1, x0, width - x1);

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
