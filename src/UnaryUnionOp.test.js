const test = require('tape'),
  UnaryUnionOp = require('./UnaryUnionOp'),
  {featureCollection, lineString, multiLineString, point, multiPoint, polygon, multiPolygon} = require('@turf/helpers');

test('UnaryUnionOp :: Input Clasification', t => {
  const geoJson = featureCollection([
    point([1, 1]),
    point([3, 3]),
    multiPoint([[0, 0], [10, 10]]),
    lineString([[0, 1], [3, 4]]),
    lineString([[0, 4], [0, 4]]),
    multiLineString([[[-1, -1], [10, 10]]]),
    polygon([[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]),
    multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]),
  ]),
    unaryUnionOp = new UnaryUnionOp(geoJson);

  t.equal(unaryUnionOp.points.length, 4, 'Points must be correctly extracted');
  t.equal(unaryUnionOp.lines.length, 3, 'Lines must be correctly extracted');
  t.equal(unaryUnionOp.polygons.length, 2, 'Polygons must be correctly extracted');

  t.end();
});
