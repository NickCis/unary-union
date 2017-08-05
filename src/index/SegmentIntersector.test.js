const test = require('tape');
const sinon = require('sinon');

const Edge = require('../Edge');
const LineIntersector = require('../LineIntersector');
const SegmentIntersector = require('./SegmentIntersector');

test("SegmentIntersector", t => {
  const li = new LineIntersector();
  const si = new SegmentIntersector(li, true, false);
  const e0 = new Edge([[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]);
  const e1 = new Edge([[0, 2], [4, 2]]);

  const mockE0 = sinon.mock(e0);
  mockE0.expects('addIntersections').twice();

  const mockE1 = sinon.mock(e1);
  mockE1.expects('addIntersections').twice();

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

  mockE0.verify();
  mockE1.verify();

  // TODO: hasProperInteriorIntersection
  // TODO: isBoundaryPointVectorVector
  // TODO: isBoundaryPointVector
  t.end();
});
