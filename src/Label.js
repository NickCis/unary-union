const TopologyLocation = require('./TopologyLocation');
const Location = require('./Location');

/** GEOS's geos::geomgraph::Label
 * [Header file](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/geomgraph/Label.h)
 * [Cpp file](https://github.com/echoz/xlibspatialite/blob/master/geos/src/geomgraph/Label.cpp)
 */
class Label {
  /**
   * `Label::Label(int geomIndex, int onLoc, int leftLoc, int rightLoc)`
   * Construct a Label with On, Left and Right locations for the
   * given Geometries.
   *
   * Initialize the locations for the other Geometries to Location::UNDEF
   *
   * `Label:Label(int geomIndex, int onLoc)`
   * Construct a Label with the location specified for the given Geometry.
   *
   * Other geometry location will be set to Location::UNDEF.
   *
   * `Label::Label()`
   * Initialize both locations to Location::UNDEF
   * isNull() should return true after this kind of construction
   *
   * @param {Number} geomIndex - [optional]
   * @param {Number} onLoc - [optional]
   * @param {Number} leftLoc - [optional]
   * @param {Number} rightLoc - [optional]
   */
  constructor(...args) {
    switch(args.length) {
      case 0:
        this.elt = [
          new TopologyLocation(Location.UNDEF),
          new TopologyLocation(Location.UNDEF),
        ]; //< {TopologyLocation[2]}
        break;

      case 2:
        const [geomIndex, onLoc] = args;
        this.elt = [
          new TopologyLocation(Location.UNDEF),
          new TopologyLocation(Location.UNDEF),
        ]; //< {TopologyLocation[2]}
        this.elt[geomIndex].setLocation(onLoc);
        break;

      case 4:
        const [geomIndex, onLoc, leftLoc, rightLoc] = args;
        this.elt = [
          new TopologyLocation(Location.UNDEF, Location.UNDEF, Location.UNDEF),
          new TopologyLocation(Location.UNDEF, Location.UNDEF, Location.UNDEF),
        ]; //< {TopologyLocation[2]}
        this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
        break;

      default:
        throw new Error(`Label(args: ${args}) (length: ${args.length}) Not implemented!`);
        break;
    }
  }

  /**
   * @param {Number} geomIndex -
   * @param {Number} posIndex -
   */
  getLocation(geomIndex, posIndex) {
    return this.elt[geomIndex].get(posIndex);
  }

  /**
   */
  flip() {
    this.elt.forEach(t => t.flip());
  }

  /**
   * @param {Label} -
   */
  merge(lbl) {
    for (let i=0; i < this.elt.length; i++) {
      this.elt[i].merge(lbl.elt[i]);
    }
  }

  /** `bool Label::isNull() const`
   */
  isObjectNull() {
    return this.elt.every(gl => gl.isNull());
  }
}

module.exports = Label;
