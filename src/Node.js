const Label = require('./Label');

/** geos::geomgraph::Node
 */
class Node {
  /**
   * XXX: check constructor!
   * @param {Coordinate|Number[]} newCoord -
   * @param {Label} newLabel -
   */
  constructor(newCoord, newLabel) {
    this.coord = newCoord;
    this.label = newLabel;
  }

  /**
   * @param {Number} argIndex -
   * @param {Number} onLocation -
   */
  setLabel(argIndex, onLocation) {
    if (this.label)
      this.label.setLocation(argIndex, onLocation);
    else
      this.label = new Label(argIndex, onLocation);
  }

  /**
   * @returns {Coordinate|Number[]}
   */
  getCoordinate() {
    return this.coord;
  }

  /**
   * XXX: check if this does sth more
   * @returns {Label}
   */
  getLabel() {
    return this.label;
  }
}

module.exports = Node;
