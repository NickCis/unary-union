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

module.exports = {
  removeRepeatedPoints,
  getCoordinateKey,
}
