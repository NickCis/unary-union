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
    if (! coordKey in this.nodeMap)
      this.nodeMap[coordKey] = new Node(coord);

    return this.nodeMap[coordKey];
  }

  forEach(f) {
    Object.keys(this.nodeMap)
      .map(k => this.nodeMap[k])
      .forEach(f);
  }
}

module.exports = NodeMap;
