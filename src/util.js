/**
 * @param {Number[2]/Coordinate} coord -
 */
function getCoordinateKey(coord) {
  return coord.join(';');
}

/**
 * @params {Array[Coordinate]} points -
 */
function removeRepeatedPoints(points) {
  const uniq = [],
    hash = {};
  points.forEach(p => {
    const k = getCoordinateKey(p);
    if (! (k in hash)) {
      hash[k] = true;
      uniq.push(p);
    }
  });
  return uniq;
}

/** GEOS's `geos::algorithm::Mod2BoundaryNodeRule::isInBoundary`
 * It is the `OGC_SFS_BOUNDARY_RULE` algorithm
 */
function isInBoundary(boundaryCount) {
  // the "Mod-2 Rule"
  return boundaryCount % 2 == 1;
}

/** Returns the direction of the point q relative to the vector p1 -> p2.
 * Implementation of geos::algorithm::CGAlgorithm::orientationIndex()
 * (same as geos::algorithm::CGAlgorithm::computeOrientation())
 *
 * @param {Number[]|Coordinate} p1 - the origin point of the vector
 * @param {Number[]|Coordinate} p2 - the final point of the vector
 * @param {Number[]|Coordinate} q - the point to compute the direction to
 *
 * @returns {Number} - 1 if q is ccw (left) from p1->p2,
 *    -1 if q is cw (right) from p1->p2,
 *     0 if q is colinear with p1->p2
 */
function orientationIndex(p1, p2, q) {
  const dx1 = p2[0] - p1[0],
    dy1 = p2[1] - p1[1],
    dx2 = q[0] - p2[0],
    dy2 = q[1] - p2[1];

  return Math.sign(dx1 * dy2 - dx2 * dy1);
}

/** Check if two coordinates are equal.
 * @param {Coordinate} p -
 * @param {Coordinate} 1 -
 * @return {boolean} - True if coordinates are equal
 */
function equals2D(p, q) {
  return p[0] === q[0] && p[1] === q[1];
}

/** GEOS's `geos::geom::Envelope::intersects(const Coordinate& p1, const Coordinate& p2, const Coordinate& q)`
 *
 * Test the point q to see whether it intersects the
 * Envelope defined by p1-p2
 *
 * @param {Coordinate} p1 - one extremal point of the envelope
 * @param {Coordinate} p2 - another extremal point of the envelope
 * @param {Coordinate} q - the point to test for intersection
 * @return {boolean} - `true` if q intersects the envelope p1-p2
 */
function envelopeIntersectsPoint(p1, p2, q) {
  //OptimizeIt shows that Math#min and Math#max here are a bottleneck.
  //Replace with direct comparisons. [Jon Aquino]
  if (
    (
      (q[0] >= (p1[0] < p2[0] ? p1[0] : p2[0])) &&
      (q[0] <= (p1[0] > p2[0] ? p1[0] : p2[0]))
    ) &&
    (
      (q[1] >= (p1[1] < p2[1] ? p1[1] : p2[1])) &&
      (q[1] <= (p1[1] > p2[1] ? p1[1] : p2[1])))
  )
    return true;

  return false;
}

/** GEOS's `geos::geom::Envelope::intersects(const Coordinate& p1, const Coordinate& p2, const Coordinate& q1, const Coordinate& q2)`
 * Test the envelope defined by p1-p2 for intersection
 * with the envelope defined by q1-q2
 *
 * @param {Coordinate} p1 - one extremal point of the envelope P
 * @param {Coordinate} p2 - another extremal point of the envelope P
 * @param {Coordinate} q1 - one extremal point of the envelope Q
 * @param {Coordinate} q2 - another extremal point of the envelope Q
 *
 * @return {boolean} - `true` if Q intersects P
 */
function envelopeIntersectsEnvelope(p1, p2, q1, q2) {
  let minq = Math.min(q1[0], q2[0]);
  let maxq = Math.max(q1[0], q2[0]);
  let minp = Math.min(p1[0], p2[0]);
  let maxp = Math.max(p1[0], p2[0]);

  if (minp > maxq)
    return false;
  if (maxp < minq)
    return false;

  minq = Math.min(q1[1], q2[1]);
  maxq = Math.max(q1[1], q2[1]);
  minp = Math.min(p1[1], p2[1]);
  maxp = Math.max(p1[1], p2[1]);

  if (minp > maxq)
    return false;
  if (maxp < minq)
    return false;

  return true;
}

module.exports = {
  removeRepeatedPoints,
  getCoordinateKey,
  orientationIndex,
  equals2D,
  envelopeIntersectsPoint,
  envelopeIntersectsEnvelope,
}
