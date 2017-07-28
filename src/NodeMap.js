const Location = require('./Location');
const {getCoordinateKey} = require('./util');

class NodeMap {
  constructor() {
    this.nodeMap = {};
  }

  /**
   * @param {Coordinate/Number[]} coord -
   * @returns {Node}
   */
  addNode(coord) {
    const coordKey = getCoordinateKey(coord);
    if (! (coordKey in this.nodeMap))
      this.nodeMap[coordKey] = new Node(coord);

    return this.nodeMap[coordKey];
  }

  forEach(f) {
    Object.keys(this.nodeMap)
      .map(k => this.nodeMap[k])
      .forEach(f);
  }

  /**
   * Finds a node in the map by coordinate
   * @param {Coordinate} coord - coordinate to use as key
   * @return {Node} - Node founded or undefined
   */
  find(coord) {
    const coordKey = getCoodinateKey(coord);
    if (getCoodinateKey(coord) in this.nodeMap)
      return this.nodeMap[coordKey];

    return undefined;
  }

  /**
   * @param {Number} geomIndex -
   * @return {Node[]} -
   */
  getBoundaryNodes(geomIndex) {
    const bdyNodes = [];
    this.forEach(node => {
      if (node.getLabel().getLocation(geomIndex) == Location.BOUNDARY)
        bdyNodes.push(node);
    });

    return bdyNodes;
  }
}

module.exports = NodeMap;
