const EdgeSetIntersector = require('./');

class SimpleEdgeIntersector extends EdgeSetIntersector {
  constructor() {
    super();
    //this.nOverlaps = 0;
  }

  computeSelfIntersections(edges, si, testAllSegments) {
    //this.nOverlaps = 0;
    console.log(edges);
    edges.forEach(edge0 => {
      edges.forEach(edge1 => {
        if (testAllSegments || edge0 != edge1)
          this.computeMutualIntersections(edge0, edge1, si);
      });
    });
  }

  /**
   * Performs a brute-force comparison of every segment in each Edge.
   * This has n^2 performance, and is about 100 times slower than using
   * monotone chains.
   *
   * @param {Edge[]} e0 -
   * @param {Edge[]} e1 -
   * @param {SegmentIntersector} si -
   */
  computeMutualIntersections(e0, e1, si) {
    const pts0 = e0.getCoordinates();
    const pts1 = e1.getCoordinates();

    for (let i0 = 0; i0 < pts0.length - 1; ++i0) {
      for (let i1 = 0; i1 < pts1.length - 1; ++i1) {
        si.addIntersections(e0, i0, e1, i1);
      }
    }
  }
}

module.exports = SimpleEdgeIntersector;
