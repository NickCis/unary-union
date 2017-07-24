const LineIntersector = require('./LineIntersector');
const GeometryGraph = require('./GeometryGraph');
const PlanarGraph = require('./PlanarGraph');

/** GEOS's OverlayOp (includes GeometryGraphOperation)
 */
class OverlayOp {
  /**
   * @param {Geometry} geom0 -
   * @param {Geometry} geom1 -
   * @param {Number} opcode - ?
   */
  static overlayOp(geom0, geom1, opCode) {
    const gov = new OverlayOp(geom0, geom1);
    return gov.getResultGeometry(opCode);
  }

  constructor(geom0, geom1) {
    // GeometryGraphOperation constructor
    this.li = new LineIntersector();
    this.arg = [
      new GeometryGraph(0, geom0),
      new GeometryGraph(1, geom1),
    ];

    this.graph = new PlanarGraph();
  }

  /**
   * computeOverlay
   */
  getResultGeometry() {
    // Copy points from input Geometries.
    // This ensures that any Point geometries
    // in the input are considered for inclusion in the result set
    this.copyPoints(0);
    this.copyPoints(1);

    // node the input Geometries
    // TODO:
    this.arg[0].computeSelfNodes(this.li, false);
    this.arg[1].computeSelfNodes(this.li, false);
  }

  /**
   * Copy all nodes from an arg geometry into this graph.
   *
   * The node label in the arg geometry overrides any previously
   * computed label for that argIndex.
   * (E.g. a node may be an intersection node with
   * a previously computed label of BOUNDARY,
   * but in the original arg Geometry it is actually
   * in the interior due to the Boundary Determination Rule)
   *
   * @param {Number} argIndex -
   */
  copyPoints(argIndex) {
    this.arg[argIndex]
      .getNodeMap()
      .forEach(graphNode => {
        const newNode = this.graph.addNode(graphNode.getCoordinate());
        newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
      });
  }

  static get opUNION() {
    return 'OP_UNION';
  }
}

module.exports = OverlayOp;
