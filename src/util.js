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

module.exports = {
  removeRepeatedPoints,
  getCoordinateKey,
  orientationIndex,
  equals2D,
}
