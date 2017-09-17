const EdgeIntersectionList = require('./EdgeIntersectionList');
const {equals2D} = require('./util');
const Label = require('./Label');
const Depth = require('./Depth');

/** GEOS's geos::geomgraph::Edge
 * [Header file](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/geomgraph/Edge.h)
 * [Cpp file](https://github.com/echoz/xlibspatialite/blob/master/geos/src/geomgraph/Edge.cpp)
 */
class Edge {
  /**
   * TODO: Check constructor
   *
   * `Edge::Edge(CoordinateSequence* newPts, const Label& newLabel)`
   * @param {Coordinates[]} newPts -
   * @params {Label} label -
   */
  constructor(newPts, label) {
    // GraphComponent ----
    this.label = label ? label : new Label();

    // ---
    this.pts = newPts;
    this.isIsolatedVar = false;
    this.eiList = new EdgeIntersectionList(this);
    this.depth = new Depth();
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

  /**
   * @param {Edge} e -
   * @return {boolean] - true if the coordinate sequences of the Edges are identical
   */
  isPointwiseEqual(e) {
    const npts = this.getNumPoints();
    const enpts = e.getNumPoints();

    if (npts != enpts)
      return false;

    for (let i=0; i < npts; ++i) {
      if (! equals2D(this.pts[i], e.pts[i]))
        return false;
    }

    return true;
  }

  /**
   * @return {Depth} -
   */
  getDepth() {
    return this.depth;
  }
}

module.exports = Edge;
