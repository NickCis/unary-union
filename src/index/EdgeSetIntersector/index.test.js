const test = require('tape');
const sinon = require('sinon');

const Edge = require('../../Edge');
const LineIntersector = require('../../LineIntersector');
const SegmentIntersector = require('../SegmentIntersector');
const SimpleEdgeIntersector = require('./SimpleEdgeIntersector');

[SimpleEdgeIntersector, ].forEach(klass => {
  test(`${klass.name} :: mutualIntersection`, t => {
    const li = new LineIntersector();
    const si = new SegmentIntersector(li, true, false);
    const esi = new klass();
    const e0 = new Edge([[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]);
    const e1 = new Edge([[0, 2], [4, 2]]);

    const mockE0 = sinon.mock(e0);
    mockE0.expects('addIntersections').twice();

    const mockE1 = sinon.mock(e1);
    mockE1.expects('addIntersections').twice();

    esi.computeMutualIntersections(e0, e1, si)

    mockE0.verify();
    mockE1.verify();
    t.end();
  });

  test(`${klass.name} :: computeSelfIntersections :: false`, t => {
    const li = new LineIntersector();
    const si = new SegmentIntersector(li, true, false);
    const esi = new klass();
    const e0 = new Edge([[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]);
    const e1 = new Edge([[0, 2], [4, 2]]);

    const mockE0 = sinon.mock(e0);
    mockE0.expects('addIntersections').exactly(4);

    const mockE1 = sinon.mock(e1);
    mockE1.expects('addIntersections').exactly(4);

    esi.computeSelfIntersections([e0, e1], si, false)

    mockE0.verify();
    mockE1.verify();
    t.end();
  });

  test(`${klass.name} :: computeSelfIntersections :: true`, t => {
    const li = new LineIntersector();
    const si = new SegmentIntersector(li, true, false);
    const esi = new klass();
    const e0 = new Edge([[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]);
    const e1 = new Edge([[0, 2], [4, 2]]);

    const mockE0 = sinon.mock(e0);
    mockE0.expects('addIntersections').exactly(8);

    const mockE1 = sinon.mock(e1);
    mockE1.expects('addIntersections').exactly(4);

    esi.computeSelfIntersections([e0, e1], si, true)

    mockE0.verify();
    mockE1.verify();
    t.end();
  });
});
