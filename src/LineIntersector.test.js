const test = require('tape');
const LineIntersector = require('./LineIntersector');

test('LineIntersector', t => {
  const lineIntersector = new LineIntersector();

  lineIntersector.computeIntersection([0, 0], [0, 1], [1, 0], [1, 1]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection');

  lineIntersector.computeIntersection([0, 1], [0, 0], [1, 1], [1, 0]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection - reversed');

  lineIntersector.computeIntersection([0, 0], [1, 1], [2, 2], [3, 3]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection collinear');

  lineIntersector.computeIntersection([1, 1], [0, 0], [2, 2], [3, 3]);
  t.notOk(lineIntersector.hasIntersection(), 'No intersection collinear - reversed');

  lineIntersector.computeIntersection([1, 0], [1, 2], [0, 1], [2, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - Point intersection');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');

  lineIntersector.computeIntersection([1, 1], [2, 2], [1, 2], [2, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - Point intersection');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');

  lineIntersector.computeIntersection([0, 0], [2, 2], [0, 0], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - himself');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection');

  lineIntersector.computeIntersection([2, 2], [0, 0], [0, 0], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - himself - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection - reversed');

  lineIntersector.computeIntersection([0, 0], [3, 3], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - smaller collinear segment');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection');

  lineIntersector.computeIntersection([3, 3], [0, 0], [2, 2], [1, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection - smaller collinear segment - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.COLLINEAR_INTERSECTION, 'Has collinear intersection - reversed');

  lineIntersector.computeIntersection([0, 0], [1, 1], [0, 0], [0, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection');

  lineIntersector.computeIntersection([1, 1], [0, 0], [0, 0], [0, 1]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection - reversed');

  lineIntersector.computeIntersection([0, 0], [1, 1], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint collinear');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection endpoint collinear');

  lineIntersector.computeIntersection([1, 1], [0, 0], [1, 1], [2, 2]);
  t.ok(lineIntersector.hasIntersection(), 'Has intersection endpoint collinear - reversed');
  t.equals(lineIntersector.getIntersectionNum(), LineIntersector.POINT_INTERSECTION, 'Has point intersection endpoint collinear - reversed');

  t.end();
});
