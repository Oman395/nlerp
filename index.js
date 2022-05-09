import * as math from "mathjs";

// The formula I'm following is from here:
// https://pimiddy.wordpress.com/2011/01/20/n-dimensional-interpolation/
// Whoever wrote it is smarter than me, I've been trying to figure out how to do this for way too long

/**
 * Simple linear interpolation
 * @param {number} a - Number between 0-1, which controls the interpolation
 * @param b - Number or vector representing the item at a=0
 * @param c - Number or vector representing the item at a=1
 */
export function lerp(a, b, c) {
  return math.add(math.multiply(1 - a, b), math.multiply(a, c));
}

/**
 * Recursive N-Dimensional linear interpolation
 * @param {number} n - Dimensions
 * @param {array} a - Array of values (vector or scalar). Must be 2 * n long.
 * @param {array} t - Vector representing the position to interpolate. Must be a vector.
 * @param {number} i - Set this to zero. Used internally for recursion.
 * @param {function} f - Base interpolation function. If you don't know what to use, use this module's lerp function.
 **/
export function rlerp(n, a, t, i, f) {
  if (n != 1) {
    let rval = f(
      t[n - 1],
      rlerp(n - 1, a, t, i, f),
      rlerp(n - 1, a, t, i + math.pow(2, n - 1), f)
    );
    return rval;
  }
  return f(t[0], a[i], a[i + 1]);
}

function classify(p1, p2) {
  let ret = 0;
  for (let i = 0; i < p1.length; i++) {}
}

function distance(p1, p2) {
  // Probably not the *best* n-dimensional distance function but it works
  let acc = 0;
  p1.forEach((val, i) => {
    acc += math.pow(val - p2[i], 2);
  });
  return math.sqrt(acc);
}

/**
 * Given a set of points, choose which ones "contain" the point that needs to be interpolated
 * @param {array} point - Vector representing the point we want to choose points for
 * @param {array} points - Array of vectors, which are the points we need to choose for. There must be more than 2^n points, where n is the number of dimensions.
 */
export function choose(point, points) {
  if (points.length < 2 ** point.length) {
    throw new Error("Not enough points!");
  }
  let choices = [];
  /*
   * This is a pretty simple method to choose. We can represent which point a point represents with a binary number; less
   * than the number to check by is 0, greater than is 1.
   * For the point (0,0), and the input vector (0.5,0.5), (0,0) would represent 0.
   * 0-0
   * x-y
   * This extends to any dimension:
   * 0--0....0
   * x1-x2...xn
   * We first sort by distance from checking point, descending. This allows us to store the points in the array at their
   * position, and when we finish, we will either have all the necessary points filled out with the closest points that
   * fit the criteria, or we will have something undefined, which indicates an incomplete dataset.
   */
  points = points.sort((a, b) => {
    return distance(b, point) - distance(a, point);
  });
  points.forEach((point) => {
    choices[classify(point)] = point;
  });
  if (choices.length != 2 ** point.length || choices.some((choice) => !choice))
    return false; // Invalid dataset
  return choices;
}

choose(
  [0, 0],
  [
    [-1, -1],
    [2, 2],
    [0, 1],
    [1, 2],
  ]
);

export function normalize(point, points) {}

export default {
  lerp,
  rlerp,
};
