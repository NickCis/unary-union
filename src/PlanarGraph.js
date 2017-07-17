const NodeMap = require('./NodeMap);

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
}

module.exports = PlanarGraph;
