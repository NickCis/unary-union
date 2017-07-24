const {flattenEach} = require('@turf/meta');
const {getGeomType, geometryCollection} = require('@turf/invariant');
const OverlayOp = require('./OverlayOp');

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
   * @param {Geometry|GeometryCollection} g0 - a geometry
   * @return the union of the input geometry
   */
  unionNoOpt(g0) {
    // XXX: GEOS passes an empty Geometry, afaik here GeoJSON doesn't have the concept of an empty geometry
    const empty = undefined;
    return OverlayOp.overlayOp(g, empty, OverlayOp.opUNION);
  }

  /**
   * Gets the union of the input geometries.
   *
   * If no input geometries were provided, a POINT EMPTY is returned.
   *
   * @return a Geometry containing the union
   * @return an empty GEOMETRYCOLLECTION if no geometries were provided
   *         in the input
   */
  Union() {
    /**
     * For points and lines, only a single union operation is
     * required, since the OGC model allowings self-intersecting
     * MultiPoint and MultiLineStrings.
     * This is not the case for polygons, so Cascaded Union is required.
     */

    let unionPoints;
    if (this.points.length > 0) // Should a MultyPoint be sent instead?
      unionPoints = this.unionNoOpt(geometryCollection(this.points));

    let unionLines;
    if (this.lines.length > 0) {
      // TODO: cascade Union
      unionLines = this.unionNoOpt(geometryCollection(this.lines));
    }

    // TODO:
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
