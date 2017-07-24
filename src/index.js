const UnaryUnionOp = require('./UnaryUnionOp);

module.exports = function unaryUnion(geoJson) {
  const op = UnaryUnionOp(geoJson);
  return op.Union();
}
