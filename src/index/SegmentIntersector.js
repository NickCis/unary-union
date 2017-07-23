/** GEOS's `geos::geomgraph::index::SegmentIntersector` class
 *
 */
class SegmentIntersector {
  /**
   * @param {LineIntersector} newLi -
   */
  constructor(newLi) {
    this.li = newLi;
  }


  /**
   * This method is called by clients of the EdgeIntersector class to test
   * for and add intersections for two segments of the edges being intersected.
   * Note that clients (such as MonotoneChainEdges) may choose not to intersect
   * certain pairs of segments for efficiency reasons.
   *
   * @param {Edge} e0 -
   * @param {Number} segIndex0 -
   * @param {Edge} e1 -
   * @param {Number} segIndex1 -
   */
  addIntersections(e0, segIndex0, e1, segIndex1) {
    if (e0 == e1 && segIndex0 == segIndex1)
      return;

    const cl0 = e0.getCoordinates();
    const p00 = cl0[segIndex0];
    const p01 = cl0[segIndex0+1];
    const cl1 = e1.getCoordinates();
    const p10 = cl1[segIndex1];
    const p11 = cl1[segIndex1+1];

    this.li.computeIntersections(p00, p01, p10, p11);
    // TODO:
  }
}

module.exports = SegmentIntersector;
