const {getCoordinateKey} = require('./util');

function getEdgeKey(e) {
  return this.pts
    .map(c => getCoordianteKey(c))
    .join('|');
}

/** GEOS's `geos::geomgraph::EdgeList`
 * A EdgeList is a list of Edges.
 *
 * It supports locating edges
 * that are pointwise equals to a target edge.
 *
 * [Header file](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/geomgraph/EdgeList.h)
 * [Cpp file](https://github.com/echoz/xlibspatialite/blob/master/geos/src/geomgraph/EdgeList.cpp)
 */
class EdgeList {
  constructor() {
    this.edges = []; //< {Edge[]}
    /* XXX: GEOS uses a `noding::OrientedCoordinateArray` in order to index the Edges,
     * in order to avoid implementing it, i'll create an index with 
     */
    this.ocaMap = {};
  }

  /**
   * @param {Edge} e -
   */
  add(e) {
    this.edges.push(e);
    this.ocaMap[getEdgeKey(e)] = e;
  }

  /**
   * @param {Edge} e -
   * @return {Edge} -
   */
  findEqualEdge(e) {
    return this.ocaMap[getEdgeKey(e)];
  }

  /**
   * @param {Number} i -
   * @return {Edge} -
   */
  get(i) {
    return this.edges[i];
  }
}

module.exports = EdgeList;
