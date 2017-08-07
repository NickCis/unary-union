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
   * `TopologyLocation::TopologyLocation(int on, int left, int right)`
   * Constructs a TopologyLocation specifying how points on, to the
   * left of, and to the right of some GraphComponent relate to some
   * Geometry.
   *
   * Possible values for the parameters are Location::UNDEF,
   * Location::EXTERIOR, Location::BOUNDARY, and Location::INTERIOR.
   *
   * `TopologyLocation::TopologyLocation(int on)`
   *
   * @param {Number} on -
   * @param {Number} left - [optional]
   * @param {Number} right - [optional]
   */
  constructor(on, ...args) {
    if (args.length == 2) {
      const [left, right] = args;
      this.location = {
        [Position.ON]: on,
        [Position.LEFT]: left,
        [Position.RIGHT]: right
      };
    } else if (args.length === 0) {
      this.location = {
        [Position.ON]: on,
      };
    } else {
      throw new Error("Not implemented!");
    }
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
   * @return {LocationEnum} -
   */
  get(posIndex) {
    return posIndex in this.location ? this.location[posIndex] : Location.UNDEF;
  }

  /**
   */
  flip() {
    if (Object.keys(this.location).length <= 1)
      return;

    let temp = this.location[Position.LEFT];
    this.location[Position.LEFT] = this.location[Position.RIGHT];
    this.location[Position.RIGHT] = temp;
  }

  /**
   * merge updates only the UNDEF attributes of this object
   * with the attributes of another.
   *
   * @param {TopologyLocation} gl -
   */
  merge(gl) {
    // if the src is an Area label & and the dest is not, increase the dest to be an Area
    const sz = Object.keys(this.location).length;
    const glsz = Object.keys(gl.location).length;

    if (glsz > sz) {
      this.location[Position.LEFT] = Location.UNDEF;
      this.location[Position.RIGHT] = Location.UNDEF;
    }

    Object.keys(this.location).forEach(k => {
      if (this.location[k] === Location.UNDEF && k in gl.location)
        this.location[k] = gl.location[k];
    });
  }

  /**
   * @return {boolean} - true if all locations are Location.UNDEF
   */
  isNull() {
    return Object.keys(this.location)
      .every(k => this.location[k] === Location.UNDEF);
  }
}

module.exports = TopologyLocation;
