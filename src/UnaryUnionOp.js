const {flattenEach} = require('@turf/meta'),
  {getGeomType} = require('@turf/invariant');

class UnaryUnionOp {
  constructor(geoJson) {
    // TODO: validate input
    this.points = [];
    this.lines = [];
    this.polygons = [];
    this.extractGeoms(geoJson);
  }

  /**
   * Computes a unary union with no extra optimization,
   * and no short-circuiting.
   * Due to the way the overlay operations
   * are implemented, this is still efficient in the case of linear
   * and puntal geometries.
   * Uses robust version of overlay operation
   * to ensure identical behaviour to the <tt>union(Geometry)</tt> operation.
   *
   * @param geo a geometry
   * @return the union of the input geometry
   */
  unionNoOp(geo) {

  }

  extractGeoms(geoJson) {
    flattenEach(geoJson, feature => {
      switch(getGeomType(feature)) {
        case 'Point':
          this.points.push(feature);
          break;

        case 'LineString':
          this.lines.push(feature);
          break;

        case 'Polygon':
          this.polygons.push(feature);
          break;

        default:
          throw new Error(`Invalid geometry ${getGeomType(feature)}`);
          break;
      }
    });
  }
}

module.exports = UnaryUnionOp;
