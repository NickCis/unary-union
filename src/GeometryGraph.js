const {getGeomType, getCoord} = require('@turf/invariant');
const booleanClockwise = require('@turf/boolean-clockwise');
const {removeRepeatedPoints, getCoordinateKey, isInBoundary} = require('./util');
const PlanarGraph = require('./PlanarGraph');
const Edge = require('./Edge');
const Label = require('./Label');
const Node = require('./Node');
const Location = require('./Location');

/** GEOS's geos::geomgraph::GeometryGraph
 * A GeometryGraph is a graph that models a given geometry
 */
class GeometryGraph extends PlanarGraph {
  /**
   * @param {Number} argIndex -
   * @param {Geometry} parentGeom -
   */
  constructor(argIndex, parentGeom) {
    this.argIndex = argIndex; //< {Number}
    this.parentGeom = parentGeom; //< {Geometry}
    this.useBoundaryDeterminationRule = true;

    /**
     * The lineEdgeMap is a map of the linestring components of the
     * parentGeometry to the edges which are derived from them.
     * This is used to efficiently perform findEdge queries
     *
     * Following the above description there's no need to
     * compare LineStrings other then by pointer value.
     *
     * XXX: check!
     */
    this.lineEdgeMap = {};

    if (this.parentGeom)
      this.add(this.parentGeom);
  }

  /**
   * @param {Geometry} g -
   */
  add(g) {
    // XXX: Check if g is empty?
    const type = getGeomType(g);

    // XXX: dynamic_cast of multipolygon, is it possible? -> Aren't we flatenning things on UnaryUnionOp?

    // check if this Geometry should obey the Boundary Determination Rule
    // all collections except MultiPolygons obey the rule
    if (type === 'MultiPolygon')
      useBoundaryDeterminationRule = false;

    switch(type) {
      case 'Polygon':
        this.addPolygon(g);
        break;

      case 'LineString':
        this.addLineString(g);
        break;

      case 'Point':
        this.addPoint(g);
        break;

      // TODO: case collection -> does this exists in this case? Aren't we flatenning things on UnaryUnionOp?

      default:
        throw new Error(`GeometryGraph::add(): unsupported type: '${type}'`);
    }
  }

  /**
   * @param {Geometry<Polygon>} p -
   */
  addPolygon(p) {
    // From spec: http://geojson.org/geojson-spec.html#polygon
    // For Polygons with multiple rings, the first must be the exterior ring and any others must be interior rings or holes.

    this.addPolygonRing(p.coordinates[0], Location.EXTERIOR, Location.INTERIOR); //< exterior ring

    // Interior Rings
    for (let i = 1; i < p.coordinates.length; i++) {
      // XXX: see note of geos
      this.addPolygonRing(p.coordinates[i], Location.INTERIOR, Location.EXTERIOR);
    }
  }

  /**
   * @param {Coordinates[]} lineRing -
   * @param {Number} cwLeft -
   * @param {Number} cwRight -
   */
  addPolygonRing(lineRing, cwLeft, cwRight) {
    const coord = removeRepeatedPoints(lineRing);

    if (coords.length < 4)
      return;

    let left = cwLeft,
      right = cwRight;

    if (! booleanClockWise(coord)) {
      left = cwRight;
      right = cwLeft;
    }

    const edge = new Edge(coord, new Label(this.argIndex, Location.BOUNDARY, left, right));

    this.insertEdge(edge);
    this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
  }

  /**
   * @param {Number} argIndex -
   * @param {Coordinate} coord -
   * @param {Number} onLocation -
   */
  insertPoint(argIndex, coord, onLocation) {
    const node = this.nodes.addNode(coord);
    node.setLabel(argIndex, onLocation);
  }

  /**
   * @param {Geometry<LineString>} line -
   */
  addLineString(line) {
    const coord = removeRepatedPoints(line.coordinates);
    if (coord.length < 2)
      return;

    // XXX: Label Stuff
    const edge = new Edge(coord, new Label(this.argIndex, Location.INTERIOR));
    this.lineEdgeMap[line] = edge;

    this.insertEdge(edge);
    this.insertBoundaryPoint(this.argIndex, coord[0]);
    this.insertBoundaryPoint(this.argIndex, coord[coord.length - 1]);
  }

  /**
   * Adds candidate boundary points using the current
   * algorithm::BoundaryNodeRule.
   *
   * This is used to add the boundary
   * points of dim-1 geometries (Curves/MultiCurves).
   *
   * Adds points using the mod-2 rule of SFS.  This is used to add the boundary
   * points of dim-1 geometries (Curves/MultiCurves).  According to the SFS,
   * an endpoint of a Curve is on the boundary
   * iff if it is in the boundaries of an odd number of Geometries
   *
   * @param {Number} argIndex -
   * @param {Coordinate/Number[]} coord -
   */
  insertBoundaryPoint(argIndex, coord) {
    const node = this.nodes.addNode(coord);

    // nodes always have labels - XXX: in this implementation i don't think so!
    const lbl = node.getLabel();

    // The new point to insert is on a boundary
    let boundaryCount = 1;

    // Determine the current location for the point (if any)
    let loc = lbl.getLocation(this.argIndex, Position.ON);
    if (loc == Location.BOUNDARY)
      boundaryCount++;

    // Determine the boundary status of the point according to the
    // Boundary Determination Rule
    let newLoc = this.determineBoundary(boundaryCount);
    lbl.setLocation(this.argIndex, newLoc);
  }

  /**
   * @param {Number} boundaryCount -
   */
  determineBoundary(boundaryCount) {
    return isInBoundary(boundaryCount) ? Location.BOUNDARY : Location.INTERIOR;
  }

  /**
   * @param {Geometry<Point>} p -
   */
  addPoint(p) {
    const coord = getCoord(p);
    this.insertPoint(this.argIndex, coord, Location.INTERIOR);
  }

  /**
   * \brief
   * Compute self-nodes, taking advantage of the Geometry type to
   * minimize the number of intersection tests.  (E.g. rings are
   * not tested for self-intersection, since
   * they are assumed to be valid).
   *
   * @param li the LineIntersector to use
   *
   * @param {Boolean} computeRingSelfNodes - if <false>, intersection checks are
   *   optimized to not test rings for self-intersection
   *
   * @return the SegmentIntersector used, containing information about
   *   the intersections found
   */
  computeSelfNodes(/*li,*/computeRingSelfNodes) {
  }
}

module.exports = GeometryGraph;
