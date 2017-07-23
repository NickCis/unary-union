/** GEOS's EdgeLineIntersector interface,
 */
class EdgeLineIntersector {
  /**
   * Computes all self-intersections between edges in a set of edges,
   * allowing client to choose whether self-intersections are computed.
   * GEOS's `EdgeLineIntersector::computeIntersections(std::vector<Edge*> *edges, SegmentIntersector *si, bool testAllSegments)`
   *
   * @param {Edge[]} edges - a list of edges to test for intersections
   * @param {SegmentIntersector} si - the SegmentIntersector to use
   * @param {boolean} testAllSegments - true if self-intersections are to be tested as well
   */
  computeSelfIntersections(edges, si, testAllSegments) {
    throw new Error("Not implemented");
  }

  /**
   * Computes all mutual intersections between two sets of edges
   * GEOS's `EdgeLineIntersector::computeIntersections(std::vector<Edge*> *edges0, std::vector<Edge*> *edges1, SegmentIntersector *si)`
   */
  computeMutualIntersections(edges0, edges1, si) {
    throw new Error("Not implemented");
  }
}

module.exports = EdgeLineIntersector;
