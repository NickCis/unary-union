const Position = require('./Position');
const Location = require('./Location');

/** GEOS's `geos::geomgraph::TopologyLocation`
 *
 * A TopologyLocation is the labelling of a
 * GraphComponent's topological relationship to a single Geometry.
 *
 * If the parent component is an area edge, each side and the edge itself
 * have a topological location.  These locations are named
 *
 *  - ON: on the edge
 *  - LEFT: left-hand side of the edge
 *  - RIGHT: right-hand side
 *
 * If the parent component is a line edge or node, there is a single
 * topological relationship attribute, ON.
 *
 * The possible values of a topological location are
 * {Location::UNDEF, Location::EXTERIOR, Location::BOUNDARY, Location::INTERIOR}
 *
 * The labelling is stored in an array location[j] where
 * where j has the values ON, LEFT, RIGHT
 */
class TopologyLocation {
  /**
   * @param {Number} on -
   * @param {Number} left -
   * @param {Number} right -
   */
  constructor(on, left, right) {
    this.location = {
      [Position.ON]: on,
      [Position.LEFT]: left,
      [Position.RIGHT]: right
    };
  }

  /**
   * @param {Number} on -
   * @param {Number} left -
   * @param {Number} right -
   */
  setLocations(on, left, right) {
    this.location[Position.ON] = on;
    this.location[Position.LEFT] = left;
    this.location[Position.RIGHT] = right;
  }

  /**
   * @param {Number} locValue -
   */
  setLocation(locValue) {
    this.location[Position.ON] = locValue;
  }

  /**
   * @param {Number} posIndex -
   */
  get(posIndex) {
    return posIndex in this.location ? this.location[posIndex] : Location.UNDEF;
  }

}

module.exports = TopologyLocation;
