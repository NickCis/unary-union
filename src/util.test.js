const test = require('tape');
const {
  envelopeIntersectsEnvelope,
} = require('./util');

test('envelopeIntersectsEnvelope', t => {
  t.notOk(envelopeIntersectsEnvelope([0, 0], [0, 1], [1, 0], [1, 1]), 'No intersection');
  t.ok(envelopeIntersectsEnvelope([1, 0], [1, 2], [0, 1], [2, 1]), 'Has intersection');
  t.ok(envelopeIntersectsEnvelope([1, 1], [2, 2], [1, 2], [2, 1]), 'Has intersection');
  t.ok(envelopeIntersectsEnvelope([0, 0], [2, 2], [0, 0], [2, 2]), 'Has intersection with himself');
  t.ok(envelopeIntersectsEnvelope([0, 0], [3, 3], [1, 1], [2, 2]), 'Has intersection with a smaller collinear');
  t.end();
});
