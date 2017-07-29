const test = require('tape');
const LineIntersector = require('./LineIntersector');

test('LineIntersector', t => {
  const lineIntersector = new LineIntersector();

  lineIntersector.computeIntersection([0, 0], [0, 1], [1, 0], [1, 1]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection');
  t.notOk(lineIntersector.isProper(), 'No intersection - isProper has to be false');

  lineIntersector.computeIntersection([0, 1], [0, 0], [1, 1], [1, 0]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection - reversed');
  t.notOk(lineIntersector.isProper(), 'No intersection - isProper has to be false');

  lineIntersector.computeIntersection([0, 0], [1, 1], [2, 2], [3, 3]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection collinear');
  t.notOk(lineIntersector.isProper(), 'No intersection - isProper has to be false');

  lineIntersector.computeIntersection([1, 1], [0, 0], [2, 2], [3, 3]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection collinear - reversed');
  t.notOk(lineIntersector.isProper(), 'No intersection - isProper has to be false');

  lineIntersector.computeIntersection([1, 0], [1, 2], [0, 1], [4, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - Point intersection');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');
  t.deepEquals(lineIntersector.getIntersection(0), [1, 1], 'Has intersection - point (1, 1)');
  t.ok(lineIntersector.isProper(), 'Has intersection - Point intersection - isProper true');
  t.equals(lineIntersector.getEdgeDistance(0, 0), 1, 'Has intersection - edge distance (0)');
  t.equals(lineIntersector.getEdgeDistance(1, 0), 1, 'Has intersection - edge distance (1)');

  lineIntersector.computeIntersection([1, 1], [2, 2], [1, 2], [2, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - Point intersection');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');
  t.ok(lineIntersector.isProper(), 'Has intersection - Point intersection - isProper true');

  lineIntersector.computeIntersection([0, 0], [2, 2], [0, 0], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - himself');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection');
  t.notOk(lineIntersector.isProper(), 'Has intersection - himself - not only on one point');
  t.equals(lineIntersector.getEdgeDistance(0, 0), 0, 'Has intersection - himself - edge distance (0)');
  t.equals(lineIntersector.getEdgeDistance(1, 0), 0, 'Has intersection - himself - edge distance (0)');

  lineIntersector.computeIntersection([2, 2], [0, 0], [0, 0], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - himself - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection - reversed');
  t.notOk(lineIntersector.isProper(), 'Has intersection - himself - not only on one point');

  lineIntersector.computeIntersection([0, 0], [3, 3], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - smaller collinear segment');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection');
  t.notOk(lineIntersector.isProper(), 'Has intersection - collinear is never proper');

  lineIntersector.computeIntersection([3, 3], [0, 0], [2, 2], [1, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - smaller collinear segment - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection - reversed');
  t.notOk(lineIntersector.isProper(), 'Has intersection - collinear is never proper');

  lineIntersector.computeIntersection([0, 0], [1, 1], [0, 0], [0, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');
  t.notOk(lineIntersector.isProper(), 'Has intersection - endpoint is not proper');

  lineIntersector.computeIntersection([1, 1], [0, 0], [0, 0], [0, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection - reversed');
  t.notOk(lineIntersector.isProper(), 'Has intersection - endpoint is not proper');

  lineIntersector.computeIntersection([0, 0], [1, 1], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint collinear');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection endpoint collinear');
  t.notOk(lineIntersector.isProper(), 'Has intersection - endpoint is not proper');

  lineIntersector.computeIntersection([1, 1], [0, 0], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint collinear - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection endpoint collinear - reversed');
  t.notOk(lineIntersector.isProper(), 'Has intersection - endpoint is not proper');

  t.end();
});
