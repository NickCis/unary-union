const LineIntersector = require('./LineIntersector');
const GeometryGraph = require('./GeometryGraph');
const PlanarGraph = require('./PlanarGraph');
const EdgeList = require('./EdgeList');

/** GEOS's OverlayOp (includes GeometryGraphOperation)
 * [Header](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/operation/overlay/OverlayOp.h)
 * [Cpp File](https://github.com/echoz/xlibspatialite/blob/master/geos/src/operation/overlay/OverlayOp.cpp)
 */
class OverlayOp {
  /**
   * @param {Geometry} geom0 -
   * @param {Geometry} geom1 -
   * @param {Number} opCode - ?
   */
  static overlayOp(geom0, geom1, opCode) {
    const gov = new OverlayOp(geom0, geom1);
    return gov.getResultGeometry(opCode);
  }

  constructor(geom0, geom1) {
    // GeometryGraphOperation constructor
    // [Header file](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/operation/GeometryGraphOperation.h)
    // [Cpp file](https://github.com/echoz/xlibspatialite/blob/master/geos/src/operation/GeometryGraphOperation.cpp)
    this.li = new LineIntersector();
    this.arg = [
      new GeometryGraph(0, geom0),
      new GeometryGraph(1, geom1),
    ];

    // OverlayOp ---
    this.graph = new PlanarGraph();
    this.edgeList = new EdgeList();
  }

  /**
   * computeOverlay
   * @param {Number} opCode - ?
   */
  getResultGeometry(opCode) {
    // Copy points from input Geometries.
    // This ensures that any Point geometries
    // in the input are considered for inclusion in the result set
    this.copyPoints(0);
    this.copyPoints(1);

    // node the input Geometries
    this.arg[0].computeSelfNodes(this.li, false);
    this.arg[1].computeSelfNodes(this.li, false);

    // compute intersections between edges of the two input geometries
    this.arg[0].computeEdgeIntersections(this.arg[1], li, false);

    const baseSplitEdges = []; //< {Edge[]}
    this.arg[0].computeSplitEdges(baseSplitEdges);
    this.arg[1].computeSplitEdges(baseSplitEdges);

    this.insertUniqueEdges(baseSplitEdges);

    // TODO:
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

  /**
   * @param {Edge[]} edges -
   */
  insertUniqueEdges(edges) {
    edges.forEach(e => this.insertUniqueEdge(e));
  }

  /**
   * @param {Edge} e -
   */
  insertUniqueEdge(e) {
    const existingEdge = this.edgeList.findEqualEdge(e);

    // If an identical edge already exists, simply update its label
    if (existingEdge) {
      const existingLabel = existingEdge.getLabel();
      const labelToMerge = e.getLabel();

      // check if new edge is in reverse direction to existing edge
      // if so, must flip the label before merging it
      if (!existingEdge.isPointwiseEqual(e))
        labelToMerge.flip();

      const depth = existingEdge.getDepth();
      if (!depth.isObjectNull())
        depth.addLabel(existingLabel);

      depth.addLabel(labelToMerge);
      existingLabel.merge(labelToMerge);
    } else { // no matching existing edge was found
      this.edgeList.add(e);
    }
  }

  static get opUNION() {
    return 'OP_UNION';
  }
}

module.exports = OverlayOp;
