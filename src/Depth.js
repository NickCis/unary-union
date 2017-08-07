const Location = require('./Location');

/** GEOS's `geos::geomgraph::Depth`
 */
const NULL_VALUE = -1;

class Depth {
  constructor() {
    this.depth = [
      [NULL_VALUE, NULL_VALUE, NULL_VALUE,],
      [NULL_VALUE, NULL_VALUE, NULL_VALUE,],
      [NULL_VALUE, NULL_VALUE, NULL_VALUE,],
    ];
  }

  /**
   * @return {Number} -
   */
  getDepth(geomIndex, posIndex) {
    return this.depth[geomIndex][posIndex];
  }

  /**
   * @param {Number} geomIndex - 0 <= geomIndex < 2
   * @param {Number} posIndex - 0 <= posIndex < 3
   * @param {Number} depthValue -
   */
  setDepth(geomIndex, posIndex, depthValue) {
    this.depth[geomIndex][posIndex] = depthValue;
  }

  /**
   * @param {Number} geomIndex - 0 <= geomIndex < 2
   * @param {Number} posIndex - 0 <= posIndex < 3
   * @return {Location} -
   */
  getLocation(geomIndex, posIndex) {
    if (this.depth[geomIndex][posIndex] <= 0)
      return Location.EXTERIOR;
    return Location.INTERIOR;
  }

  /** `void Depth::add(int geomIndex,int posIndex,int location)`
   *
   * @param {Number} geomIndex - 0 <= geomIndex < 2
   * @param {Number} posIndex - 0 <= posIndex < 3
   * @param {Location} loc -
   */
  addDepth(geomIndex, posIndex, loc) {
    if (loc == Location::INTERIOR)
      this.depth[geomIndex][posIndex]++;
  }

  /** `void add(const Label& lbl);`
   * @param {Label} -
   */
  addLabel(lbl) {
    for (let i=0; i < 2; i++) {
      for (let j=1; j < 3; j++) {
        let loc = lbl.getLocation(i, j);
        if (loc === Location.EXTERIOR || loc === Location.INTERIOR) {
          // initialize depth if it is null, otherwise
          // add this location value
          if (this.isDepthNull(i, j))
            this.depth[i][j] = this.depthAtLocation(loc);
          else
            this.depth[i][j] += this.depthAtLocation(loc);
        }
      }
    }
  }

  /** `bool Depth::isNull(int geomIndex, int posIndex) const`
   * @param {Number} geomIndex - 0 <= geomIndex < 2
   * @param {Number} posIndex - 0 <= posIndex < 3
   */
  isDepthNull(geomIndex, posIndex) {
    return this.depth[geomIndex][posIndex] === NULL_VALUE;
  }

  /**
   * @param {Location} loc -
   * @return {Number} -
   */
  depthAtLocation(loc) {
    if (loc == Location.EXTERIOR)
      return 0;
    if (loc == Location.INTERIOR)
      return 1;
    return NULL_VALUE;
  }

  /** `bool Depth::isNull() const`
   * A Depth object is null (has never been initialized) if all depths are null.
   * @return {boolean} -
   */
  isObjectNull() {
    return this.depth.some(r => {
      return r.some(e => e !== NULL_VALUE);
    });
  }
}

module.exports = Depth;
