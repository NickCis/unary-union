# Unary Union

[![Build Status](https://travis-ci.org/NickCis/unary-union.svg?branch=master)](https://travis-ci.org/NickCis/unary-union)

Compute the unary union on a list of \a geometries. May be faster than an iterative union on a set of geometries. The returned geometry will be fully noded, i.e. a node will be created at every common intersection of the input geometries. An empty geometry will be returned in the case of errors. It's basically an implementation of [QGS's Unary Union](https://github.com/qgis/QGIS/blob/master/src/core/geometry/qgsgeometry.h#L992). This last uses as backend [GEOS's `GEOSUnaryUnion_r`](https://github.com/echoz/xlibspatialite/blob/master/geos/capi/geos_c.h#L609) which by calling [`Geometry::Union()` method](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/geom/Geometry.h#L617) ends up executing the [UnaryUnionOp algorithm](https://github.com/echoz/xlibspatialite/blob/master/geos/include/geos/operation/union/UnaryUnionOp.h)

Although, the algorithm is the same as GEOS, it isn't a literal transcription of the C++ source code. It was rewriten in order to get a more javascript like code.

## JSDoc

## Example

## Documentation

### Installation

Install this module individually:

```sh
$ npm install unary-union
```
