const test = require('tape');
const Edge = require('../Edge');
const LineIntersector = require('../LineIntersector');
const SegmentIntersector = require('./SegmentIntersector');

test("SegmentIntersector", t => {
  const li = new LineIntersector();
  const si = new SegmentIntersector(li, true, false);
  const e0 = new Edge([[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]);
  const e1 = new Edge([[0, 2], [4, 2]]);

  // test -- addIntersections
  si.addIntersections(e0, 0, e1, 0);
  t.notOk(si.hasIntersection(), 'Not intersection');
  t.notOk(si.hasProperIntersection(), 'Not proper');
  si.addIntersections(e0, 1, e1, 0);
  t.ok(si.hasIntersection(), 'Has intersection');
  t.ok(si.hasProperIntersection(), 'Has proper');
  si.addIntersections(e0, 2, e1, 0);
  t.ok(si.hasIntersection(), 'Has intersection');
  si.addIntersections(e0, 3, e1, 0);
  t.ok(si.hasIntersection(), 'Has intersection');
  t.equals(si.numIntersections, 2, 'Has 2 intersections');
  t.comment(`hasIntersection ${si.hasIntersection()}`);

  // TODO: hasProperInteriorIntersection
  // TODO: isBoundaryPointVectorVector
  // TODO: isBoundaryPointVector
  t.end();
});
