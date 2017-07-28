const NodeMap = require('./NodeMap');
const Location = require('./Location');

class PlanarGraph {
  constructor() {
    this.edges = []; //< Edges[]
    this.nodes = new NodeMap() //< NodeMap
  }

  /**
   * private
   * @param {Edge} edge -
   */
  insertEdge(edge) {
    this.edges.push(edge);
  }

  /**
   * @param {Coordinate/Number[]} coord -
   * @returns {Node}
   */
  addNode(node) {
    return this.nodes.addNode(node);
  }

  /**
   * @returns {NodeMap}
   */
  getNodeMap() {
    return this.nodes;
  }

  /**
   * @param {Number} geomIndex -
   * @param {Coordinate} coord -
   * @return {boolean} -
   */
  isBoundaryNode(geomIndex, coord) {
    const node = this.nodes.find(coord);

    if (!node)
      return false;

    const label = node.getLabel();
    if (!label && label.getLocation(geomIndex) == Location.BOUNDARY)
      return true;

    return false;
  }
}

module.exports = PlanarGraph;
