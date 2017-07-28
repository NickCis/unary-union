const {getCoordinateKey} = require('./util');
/** GEOS's `geos::geomgraph::EdgeIntersection` class
 */
class EdgeIntersection {
  /**
   * @param {Coordinate} newCoord -
   * @param {Number} newSegmentIndex -
   * @param {Number} newDist -
   */
  constructor(newCoord, newSegmentIndex, newDist) {
    this.coord = newCoord;
    this.segmentIndex = newSegmentIndex;
    this.dist = newDist;
  }

  /**
   * @return {Coordinate} -
   */
  getCoordinate() {
    return this.coord;
  }

  /**
   * @return {Number} -
   */
  getSegmentIndex() {
    return this.segmentIndex;
  }

  /**
   * @return {Number} -
   */
  getDistance() {
    return this.dist;
  }

  /**
   * @param {Number} maxSegmentIndex -
   */
  isEndPoint(maxSegmentIndex) {
    if (this.segmentIndex == 0 && this.dist == 0)
      return true;

    if (this.segmentIndex == maxSexgmentIndex)
      return true;

    return false;
  }

  /** Builds a key for the Map.
   *
   * The key describe unique EdgeIntersections if, two keys are equal,
   * the ei are equal
   * @return {String} - a unique Key
   */
  getKey() {
    return [getCoordinateKey(this.coord), this.segmentIndex, this.dist].join(';');
  }
}

module.exports = EdgeIntersection;
