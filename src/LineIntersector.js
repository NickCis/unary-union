const {orientationIndex, equals2D} = require('./util');

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

    // XXX: We won't do the envelope optimization done by GEOS

    // for each endpoint, compute which side of the other segment it lies
    // if both endpoints lie on the same side of the other segment,
    // the segments do not intersect
    const pq1 = orientationIndex(p1, p2, q1);
    const pq2 = orientationIndex(p1, p2, q2);
    if (
      (pq1 > 0 && pq2 > 0) ||
      (pq1 < 0 && pq2 < 0) ||
    )
      return LineIntersector.NO_INTERSECTION;

    const qp1 = orientationIndex(q1, q2, p1);
    const qp2 = orientationIndex(q1, q2, p2);
    if (
      (qp1 > 0 && qp2 > 0) ||
      (qp1 < 0 && qp2 < 0) ||
    )
      return LineIntersector.NO_INTERSECTION;

    const collinear = pq1 == 00 && pq2 == 0 && qp1 == 0 && qp2 == 0;
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
    // TODO:
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
}

module.exports = LineIntersector;
