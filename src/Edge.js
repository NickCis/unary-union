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

  // TODO: setIsolated(boolean)
  // TODO: addIntersections(li, segIndex, number)
  // TODO: isClosed()
  // TODO: getNumPoints()
}

module.exports = Edge;
