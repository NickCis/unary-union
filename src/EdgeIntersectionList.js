const EdgeIntersection = require('./EdgeIntersection');

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
}

module.exports = EdgeIntersectionList;
