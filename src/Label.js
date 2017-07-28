const TopologyLocation = require('./TopologyLocation');
const Location = require('./Location');

/** GEOS's geos::geomgraph::Label
 * TODO
 */
class Label {
  /** Construct a Label with On, Left and Right locations for the
   * given Geometries.
   *
   * Initialize the locations for the other Geometries to
   * Location::UNDEF
   *
   * @param {Number} geomIndex -
   * @param  {Number} onLoc -
   * @param {Number} leftLoc -
   * @param {Number} rightLoc -
   */
  constructor(geomIndex, onLoc, ...args) {
    this.elt = [
      new TopologyLocation(Location.UNDEF, Location.UNDEF, Location.UNDEF),
      new TopologyLocation(Location.UNDEF, Location.UNDEF, Location.UNDEF),
    ]; //< {TopologyLocation[2]}

    if (args.length >= 2) {
      const [leftLoc, rightLoc] = args;
      this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
    } else {
      this.elt[geomIndex].setLocation(onLoc);
    }
  }

  /**
   * @param {Number} geomIndex -
   * @param {Number} posIndex -
   */
  getLocation(geomIndex, posIndex) {
    return this.elt[geomIndex].get(posIndex);
  }
}

module.exports = Label;
