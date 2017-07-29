const test = require('tape');
const Edge = require('../../Edge');
const LineIntersector = require('../../LineIntersector');
const SegmentIntersector = require('../SegmentIntersector');
const SimpleEdgeIntersector = require('./SimpleEdgeIntersector');

[SimpleEdgeIntersector, ].forEach(klass => {
  test(klass.name, t => {
    const li = new LineIntersector();
    const si = new SegmentIntersector(li, true, false);
    t.end();
  });
});
