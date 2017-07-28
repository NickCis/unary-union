const {
  orientationIndex,
  equals2D,
  envelopeIntersectsPoint,
  envelopeIntersectsEnvelope
} = require('./util');

/** GEOS's `geos::algorithm::LineIntersector` class
 *
 * A LineIntersector is an algorithm that can both test whether
 * two line segments intersect and compute the intersection point
 * if they do.
 *
 * The intersection point may be computed in a precise or non-precise manner.
 * Computing it precisely involves rounding it to an integer.  (This assumes
 * that the input coordinates have been made precise by scaling them to
 * an integer grid.)
 *
 */
class LineIntersector {
  static get NO_INTERSECTION() {
    return 0;
  }

  static get POINT_INTERSECTION() {
    return 1;
  }

  static get COLLINEAR_INTERSECTION() {
    return 2;
  }

  constructor() {
    this.result = LineIntersector.NO_INTERSECTION;
    this.isProperVar = false;
    this.inputLines = [[], []]; //< {Coordinate[][]}
    this.intPt = []; //< {Coordinate[]} Intersection Points
  }

  /** `void LineIntersector::computeIntersection(const geom::Coordinate& p1, const geom::Coordinate& p2, const geom::Coordinate& p3, const geom::Coordinate& p4)`
   *
   * Computes the intersection of the lines p1-p2 and p3-p4
   *
   * @param {Coodinate} p1 - Start of first line
   * @param {Coodinate} p2 - End of first line
   * @param {Coodinate} p3 - Start of second line
   * @param {Coodinate} p4 - End of second line
   */
  computeIntersection(p1, p2, p3, p4) {
    this.inputLines = [
      [p1, p2],
      [p3, p4],
    ];

    this.result = this.computeIntersect(p1, p2, p3, p4);
  }

  /**
   * private
   * @param {Coodinate} p1 - Start of first line
   * @param {Coodinate} p2 - End of first line
   * @param {Coodinate} p3 - Start of second line
   * @param {Coodinate} p4 - End of second line
   * @return {Number} - result
   */
  computeIntersect(p1, p2, q1, q2) {
    this.isProperVar = false;

    // first try a fast test to see if the envelopes of the lines intersect
    if (!envelopeIntersectsEnvelope(p1, p2, q1, q2))
      return LineIntersector.NO_INTERSECTION;

    // for each endpoint, compute which side of the other segment it lies
    // if both endpoints lie on the same side of the other segment,
    // the segments do not intersect
    const pq1 = orientationIndex(p1, p2, q1);
    const pq2 = orientationIndex(p1, p2, q2);
    if (
      (pq1 > 0 && pq2 > 0) ||
      (pq1 < 0 && pq2 < 0)
    )
      return LineIntersector.NO_INTERSECTION;

    const qp1 = orientationIndex(q1, q2, p1);
    const qp2 = orientationIndex(q1, q2, p2);
    if (
      (qp1 > 0 && qp2 > 0) ||
      (qp1 < 0 && qp2 < 0)
    )
      return LineIntersector.NO_INTERSECTION;

    const collinear = pq1 == 0 && pq2 == 0 && qp1 == 0 && qp2 == 0;
    if (collinear)
      return this.computeCollinearIntersection(p1, p2, q1, q2);

    /**
     * At this point we know that there is a single intersection point
     * (since the lines are not collinear).
     */

    /*
     * Check if the intersection is an endpoint.
     * If it is, copy the endpoint as
     * the intersection point. Copying the point rather than
     * computing it ensures the point has the exact value,
     * which is important for robustness. It is sufficient to
     * simply check for an endpoint which is on the other line,
     * since at this point we know that the inputLines must
     *  intersect.
     */
    if (pq1 == 0 || pq2 == 0 || qp1 == 0 || qp2 == 0) {
      if (equals2D(p1, q1) || equals2D(p1, q2)) {
        this.intPt[0] = p1;
      } else if (equals2D(p2, q1) || equals2D(p2, q1)) {
        this.intPt[0] = p2;
      } else if (pq1 == 0) { //  Now check to see if any endpoint lies on the interior of the other segment
        this.intPt[0] = q1;
      } else if (pq2 == 0) {
        this.intPt[0] = q2;
      } else if (qp1 == 0) {
        this.intPt[0] = p1;
      } else if (qp2 == 0) {
        this.intPt[0] == p2;
      }
    } else {
      this.isProperVar = true;
      this.intPt[0] = this.intersection(p1, p2, q1, q2);
    }

    return LineIntersector.POINT_INTERSECTION;
  }

  /**
   * @return {Number} - result
   */
  computeCollinearIntersection(p1, p2, q1, q2) {
    const p1q1p2 = envelopeIntersectsPoint(p1, p2, q1);
    const p1q2p2 = envelopeIntersectsPoint(p1, p2, q2);
    const q1p1q2 = envelopeIntersectsPoint(q1, q2, p1);
    const q1p2q2 = envelopeIntersectsPoint(q1, q2, p2);

    if (p1q1p2 && p1q2p2) {
      this.intPt = [q1, q2];
      return LineIntersector.COLLINEAR_INTERSECTION;
    }

    if (q1p1q2 && q1p2q2) {
      this.intPt = [p1, p2];
      return LineIntersector.COLLINEAR_INTERSECTION;
    }

    if (p1q1p2 && q1p1q2) {
      this.intPt = [q1, p1];
      return (equals2D(q1, p1) && !p1q2p2 && !q1p2q2) ? LineIntersector.POINT_INTERSECTION : LineIntersector.COLLINEAR_INTERSECTION;
    }

    if (p1q1p2 && q1p2q2) {
      this.intPt = [q1, p2];
      return (equals2D(q1, p2) && !p1q2p2 && !q1p1q2) ? LineIntersector.POINT_INTERSECTION : LineIntersector.COLLINEAR_INTERSECTION;
    }

    if (p1q2p2 && q1p1q2) {
      this.intPt = [q2, p1];
      return (equals2D(q2, p1) && !p1q1p2 && !q1p2q2) ? LineIntersector.POINT_INTERSECTION : LineIntersector.COLLINEAR_INTERSECTION;
    }

    if (p1q2p2 && q1p2q2) {
      this.intPt = [q2, p2];
      return (equals2D(q2, p2) && !p1q1p2 && !q1p1q2) ? LineIntersector.POINT_INTERSECTION : LineIntersector.COLLINEAR_INTERSECTION;
    }

    return LineIntersector.NO_INTERSECTION;
  }

  /**
   * private
   * This method computes the actual value of the intersection point.
   *
   * GEOS's implementation does more error checking, here, i only implement
   * the `geos::algorithm::HCoordinate::intersection`.
   *
   * @param {Coodinate} p1 - Start of first line
   * @param {Coodinate} p2 - End of first line
   * @param {Coodinate} p3 - Start of second line
   * @param {Coodinate} p4 - End of second line
   * @returns {Coodinate} - intersection
   */
  intersection(p1, p2, q1, q2) {
    const px = p1[1] - p2[1];
    const py = p2[0] - p1[0];
    const pw = p1[0] * p2[1] - p2[0] * p1[1];

    const qx = q1[1] - q2[1];
    const qy = q2[0] - q1[0];
    const qw = q1[0] * q2[1] - q2[0] * q1[1];

    const x = py * qw - qy * pw;
    const y = qx * pw - px * qw;
    const w = px * qy - qx * py;

    const xInt = x / w;
    const yInt = y / w;

    return [xInt, yInt];
  }

  /**
   * Tests whether the input geometries intersect.
   *
   * @return {boolean} - true if the input geometries intersect
   */
  hasIntersection() {
    return this.result != LineIntersector.NO_INTERSECTION;
  }

  /** Returns the number of intersection points found.
   * This will be either 0, 1 or 2.
   * @return {Number} - number of intersection points found.
   */
  getIntersectionNum() {
    return this.result;
  }

  /**
   * Test whether a point is a intersection point of two line segments.
   *
   * Note that if the intersection is a line segment, this method only tests for
   * equality with the endpoints of the intersection segment.
   * It does *not* return true if
   * the input point is internal to the intersection segment.
   *
   * @param {Coodinate} pt -
   * @return {boolean} - true if the input point is one of the intersection points.
   */
  isIntersection(pt) {
    for (let i=0; i < this.result; i++) {
      if (equals2D(this.intPt[i], pt))
        return true;
    }
    return false;
  }

  /**
   * Returns the intIndex'th intersection point
   *
   * @param intIndex is 0 or 1
   * @return {Coordinate} - the intIndex'th intersection point
   */
  getIntersection(intIndex) {
    return this.intPt[intIndex];
  }
  /**
   * Computes the "edge distance" of an intersection point along the specified
   * input line segment.
   *
   * @param {Number} segmentIndex - is 0 or 1
   * @param {Number} intIndex - is 0 or 1
   *
   * @return {Number} - the edge distance of the intersection point
   */
  getEdgeDistance(segmentIndex, intIndex) {
    return LineIntersector.computeEdgeDistance(
      this.intPt[intIndex],
      this.inputLines[segmentIndex][0],
      this.inputLines[segmentIndex][1]
    );
  }

  /**
   * Computes the "edge distance" of an intersection point p in an edge.
   *
   * The edge distance is a metric of the point along the edge.
   * The metric used is a robust and easy to compute metric function.
   * It is `not` equivalent to the usual Euclidean metric.
   * It relies on the fact that either the x or the y ordinates of the
   * points in the edge are unique, depending on whether the edge is longer in
   * the horizontal or vertical direction.
   *
   * NOTE: This function may produce incorrect distances
   *  for inputs where p is not precisely on p1-p2
   * (E.g. p = (139,9) p1 = (139,10), p2 = (280,1) produces distanct
   * 0.0, which is incorrect.
   *
   * My hypothesis is that the function is safe to use for points which are the
   * result of `rounding` points which lie on the line,
   * but not safe to use for `truncated` points.
   *
   * @param {Coordinate} p -
   * @param {Coordinate} p0 -
   * @param {Coordinate} p1 -
   *
   */
  static computeEdgeDistance(p, p0, p1) {
    const dx = Math.abs(p1[0] - p0[0]);
    const dy = Math.abs(p1[1] - p0[1]);
    const dist = -1.0; // sentinel value
    if (p == p0 || equals2D(p, p0)) {
      dist = 0.0;
    } else if (p == p1 || equals2D(p, p1)) {
      if (dx > dy)
        dist = dx;
      else
        dist = dy;
    } else {
      const pdx = Math.abs(p[0] - p0[0]);
      const pdy = Math.abs(p[1] - p0[1]);
      if (dx > dy)
        dist = pdx;
      else
        dist = pdy;
      // XXX: <FIX>
      // hack to ensure that non-endpoints always have a non-zero distance
      if (dist == 0.0 && !(p == p0))
        dist = Math.max(pdx, pdy);
    }

    return dist;
  }
}

module.exports = LineIntersector;
