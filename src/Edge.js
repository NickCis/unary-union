/** GEOS's geos::geomgraph::Edge
 */
class Edge {
  /**
   * @param {Array[Coordinates]} newPts -
   * @params {Label} label -
   */
  constructor(newPts, label) {
    this.pts = newPts;
  }
}

module.exports = Edge;
