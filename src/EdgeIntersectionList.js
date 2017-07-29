const EdgeIntersection = require('./EdgeIntersection');
const Edge = require('./Edge');
const {equals2D} = require('./util');

/** GEOS's `geos::geomgraph::EdgeIntersectionList` class
 */
class EdgeIntersectionList {
  /**
   * @param {Edge} -
   */
  constructor(newEdge) {
    this.edge = newEdge;
    this.nodeMap = {};
  }

  /*
   * Adds an intersection into the list, if it isn't already there.
   * The input segmentIndex and dist are expected to be normalized.
   *
   * @param {Coordinate} coord -
   * @param {Number} segmentIndex -
   * @param {Number} dist -
   * @return {EdgeIntersection} - the EdgeIntersection found or added
   */
  add(coord, segmentIndex, dist) {
    const eiNew = new EdgeIntersection(coord, segmentIndex, dist);
    if (!(eiNew.getKey() in this.nodeMap))
      this.nodeMap[eiNew.getKey()] = eiNew;
    return this.nodeMap[eiNew.getKey()];
  }

  /**
   * @return {boolean} -
   */
  isEmpty() {
    return Object.keys(this.nodeMap).length;
  }

  /**
   * Easy way to iterate over elements
   * @return {EdgeIntersection[]} - all EdgeIntersections of the List
   */
  getElements() {
    return Object.keys(this.nodeMap)
      .map(k => this.nodeMap[k]);
  }

  /**
   * Creates new edges for all the edges that the intersections in this
   * list split the parent edge into.
   * Adds the edges to the input list (this is so a single list
   * can be used to accumulate all split edges for a Geometry).
   *
   * @param {Edge[]} - edgeList a list of EdgeIntersections
   */
  addSplitEdges(edgeList) {
    // ensure that the list has entries for the first and last point
    // of the edge
    this.addEndpoints();

    // there should always be at least two entries in the list
    Object.keys(this.nodeMap)
      .map(k => this.nodeMap[k])
      .reduce((eiPrev, ei) => {
        if (eiPrev) {
          const newEdge = this.createSplitEdge(eiPrev, ei);
          edgeList.push(newEdge);
        }
        return ei;
      });
  }

  /**
   * @param {EdgeIntersection} ei0 -
   * @param {EdgeIntersection} ei1 -
   * @return {Edge} -
   */
  createSplitEdge(ei0, ei1) {
    let npts = ei1.segmentIndex - ei0.segmentIndex + 2;
    const lastSegStartPt = this.edge.pts[ei1.segmentIndex];

    // if the last intersection point is not equal to the its segment
    // start pt, add it to the points list as well.
    // (This check is needed because the distance metric is not totally
    // reliable!). The check for point equality is 2D only - Z values
    // are ignored

    const useIntPt1 = ei1.dist > 0.0 || !equals2D(ei1.coord, lastSegStartPt);
    if (useIntPt1)
      --npts;

    const vc = [] //< {Coordinate[]};

    vc.push(ei0.coord);
    for (let i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
      if (!useIntPt1 && ei1.segmentIndex == i)
        vc.push(ei1.coord);
      else
        vc.push(this.edge.pts[i]);
    }

    if (useIntPt1)
      vc.push(ei1.coord);

    return new Edge(vc, this.edge.getLabel());
  }

  /*
   * Adds entries for the first and last points of the edge to the list
   */
  addEndpoints() {
    const maxSegIndex = this.edge.getNumPoints() - 1;
    this.add(this.edge.pts[0], 0, 0.0);
    this.add(this.edge.pts[maxSegIndex], maxSegIndex, 0.0);
  }
}

module.exports = EdgeIntersectionList;
