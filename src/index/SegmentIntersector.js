/** GEOS's `geos::geomgraph::index::SegmentIntersector` class
 *
 */
class SegmentIntersector {
  /**
   * @param {LineIntersector} newLi -
   * @param {boolean} newIncludeProper -
   * @param {boolean} newRecordIsolated -
   */
  constructor(newLi, newIncludeProper, newRecordIsolated) {
    this.li = newLi;
    this.includeProper = newIncludeProper;
    this.recordIsolated = newRecordIsolated;
    this.numIntersections = 0;
    this.hasIntersectionVar = false;
    this.properIntersectionPoint = undefined; //< {Coodinate}
    this.hasProper = false;
    this.hasProperInterior = false;
    this.bdyNodes = [] //< {Node[][]}
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

    this.li.computeIntersection(p00, p01, p10, p11);
    /*
     * Always record any non-proper intersections.
     * If includeProper is true, record any proper intersections as well.
     */
    if (this.li.hasIntersection()) {
      if (this.recordIsolated) {
        e0.setIsolated(false);
        e1.setIsolated(false);
      }

      //intersectionFound = true;
      this.numIntersections++;

      // If the segments are adjacent they have at least one trivial
      // intersection, the shared endpoint.
      // Don't bother adding it if it is the
      // only intersection.
      if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
        this.hasIntersectionVar = true;
        if (this.includeProper || !this.li.isProper()) {
          e0.addIntersections(this.li, segIndex0, 0);
          e1.addIntersections(this.li, segIndex1, 1);
        }

        if (this.li.isProper()) {
          this.properIntersectionPoint = this.li.getIntersection(0);
          this.hasProper = true;

          if (this.isBoundaryPointVectorVector(this.li, this.bdyNodes))
            this.hasProperInterior = true;
        }
      }
    }
  }

  /*
   * A trivial intersection is an apparent self-intersection which in fact
   * is simply the point shared by adjacent line segments.
   * Note that closed edges require a special check for the point
   * shared by the beginning and end segments.
   *
   * @param {Edge} e0 -
   * @param {Number} segIndex0 -
   * @param {Edge} e1 -
   * @param {Number} segIndex1 -
   * @return {boolean}
   */
  isTrivialIntersection(e0, segIndex0, e1, segIndex1) {
    if (e0 == e1) {
      if (this.li.getIntersectionNum() == 1) {
        if (SegmentIntersector.isAdjacentSegments(segIndex0, segIndex1))
          return true;

        if (e0.isClosed()) {
          const maxSegIndex = e0.getNumPoints() - 1;
          if (
            (segIndex0 == 0 && segIndex1 == maxSegIndex) ||
            (segIndex1 == 0 && segIndex0 == maxSegIndex)
          )
            return true;
        }
      }
    }
    return false;
  }

  /**
   * bool SegmentIntersector::isBoundaryPoint(LineIntersector *li, vector<vector<Node*>*>& tstBdyNodes);
   * @param {LineIntersector} li -
   * @param {Node[][]} tstBdyNodes -
   * @return {boolean} -
   */
  isBoundaryPointVectorVector(li, tstBdyNodes) {
    if (this.isBoundaryPointVector(li, tstBdyNodes[0]))
      return true;
    if (this.isBoundaryPointVector(li, tstBdyNodes[1]))
      return true;
    return false;
  }

  /**
   * bool SegmentIntersector::isBoundaryPoint(LineIntersector *li, vector<Node*> *tstBdyNodes);
   * @param {LineIntersector} li -
   * @param {Node[]} tstBdyNodes -
   * @return {boolean} -
   */
  isBoundaryPointVector(li, tstBdyNodes) {
    if (!tstBdyNodes)
      return false;

    tstBdyNodes.forEach(node => {
      const pt = node.getCoordinate();
      if (li.isIntersection(pt))
        return true;
    });
  }

  static isAdjacentSegments(segIndex0, segIndex1) {
    return Math.abs(segIndex0 - segIndex1) == 1;
  }

  /**
   * @param {Nodes[]} bdyNodes0 -
   * @param {Nodes[]} bdyNodes1 -
   */
  setBoundaryNodes(bdyNodes0, bdyNodes1) {
    this.bdyNodes = [bdyNodes0, bdyNodes1];
  }

  /**
   * @return {Coordinate} -
   */
  getProperIntersectionPoint() {
    return this.properIntersectionPoint;
  }

  /**
   * @return {boolean}
   */
  hasIntersection() {
    return this.hasIntersectionVar;
  }

  /*
   * A proper intersection is an intersection which is interior to at least two
   * line segments.  Note that a proper intersection is not necessarily
   * in the interior of the entire Geometry, since another edge may have
   * an endpoint equal to the intersection, which according to SFS semantics
   * can result in the point being on the Boundary of the Geometry.
   *
   * @return {boolean} -
   */
  hasProperIntersection() {
    return this.hasProper;
  }

  /*
   * A proper interior intersection is a proper intersection which is `not`
   * contained in the set of boundary nodes set for this SegmentIntersector.
   *
   * @return {boolean} -
   */
  hasProperInteriorIntersection() {
    return this.hasProperInterior;
  }
}

module.exports = SegmentIntersector;
