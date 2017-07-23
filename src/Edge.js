/** GEOS's geos::geomgraph::Edge
 */
class Edge {
  /**
   * @param {Coordinates[]} newPts -
   * @params {Label} label -
   */
  constructor(newPts, label) {
    this.pts = newPts;
  }

  /**
   * @return {Coordinates[]}
   */
  getCoordinates() {
    return this.pts;
  }
}

module.exports = Edge;
