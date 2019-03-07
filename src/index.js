const UnaryUnionOp = require('./UnaryUnionOp.js');

module.exports = function unaryUnion(geoJson) {
  const op = UnaryUnionOp(geoJson);
  return op.Union();
}
