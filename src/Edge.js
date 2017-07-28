const EdgeIntersectionList = require('./EdgeIntersectionList');
const {equals2D} = require('util');

/** GEOS's geos::geomgraph::Edge
 */
class Edge {
  /**
   * @param {Coordinates[]} newPts -
   * @params {Label} label -
   */
  constructor(newPts, label) {
    this.pts = newPts;
    this.label = label;

    this.isIsolatedVar = false;
    this.eiList = new EdgeIntersectionList(this);
  }

  /**
   * @return {Coordinates[]}
   */
  getCoordinates() {
    return this.pts;
  }

  getLabel() {
    return this.label;
  }

  /**
   * @param {boolean} newIsIsolated -
   */
  setIsolated(newIsIsolated) {
    this.isIsolatedVar = newIsIsolated;
    // XXX: testInvariant?
  }

  /**
   * @return {boolean} -
   */
  isClosed() {
    return equals2D(this.pts[0], this.pts[this.pts.length-1]);
  }

  /**
   * @return {Number} -
   */
  getNumPoints() {
    return this.pts.length;
  }

  /**
   * Adds EdgeIntersections for one or both
   * intersections found for a segment of an edge to the edge intersection list.
   * @param {LineIntersector} li -
   * @param {Number} segmentIndex -
   * @param {Number} geomIndex -
   */
  addIntersections(li, segmentIndex, geomIndex) {
    // TODO
    for (let i=0; i < li.getIntersectionNum(); i++) {
      this.addIntersection(li, segmentIndex, geomIndex, i);
    }
  }

  /** Add an EdgeIntersection for intersection intIndex.
   *
   * An intersection that falls exactly on a vertex of the edge is normalized
   * to use the higher of the two possible segmentIndexes
   *
   * @param {LineIntersector} li -
   * @param {Number} segmentIndex -
   * @param {Number} geomIndex -
   * @param {Number} intIndex -
   */
  addIntersection(li, segmentIndex, geomIndex, intIndex) {
    const intPt = li.getIntersection(intIndex);
    let normalizedSegmentIndex = segmentIndex;
    let dist = li.getEdgeDistance(geomIndex, intIndex);

    // normalize the intersection point location
    const nextSegIndex = normalizedSegmentIndex + 1;
    const npts = this.getNumPoints();
    if (nextSegIndex < npts) {
      const nextPt = this.pts[nextSegIndex];
      if (equals2D(intPt, nextPt)) {
        normalizedSegmentIndex = nextSegIndex;
        dist = 0.0;
      }
    }

    this.eiList.add(intPt, normalizedSegmentIndex, dist);
  }
}

module.exports = Edge;
