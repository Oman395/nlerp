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
 *
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
  for (let i = 0; i < p1.length; i++) {
    if (p2[i] > p1[i]) ret += 2 ** i;
  }
  return ret;
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
  points.forEach((p) => {
    choices[classify(point, p)] = p;
  });
  // if (choices.length != 2 ** point.length || choices.includes(undefined))
  // return false; // Invalid dataset
  return choices;
}

export function normalize(point, points) {
  // First, we need to change points from
  // [(x1, x2, ..., xn), ..., (x1, x2, ..., xn)]
  // to [(x1,...,x1), (x2,...,x2), ..., (xn,...,xn)]
  // so that we can get maximums a bit easier.
  let adjpoints = [];
  for (let i = 0; i < point.length; i++) {
    adjpoints[i] = [];
    points.forEach((point) => {
      adjpoints[i].push(point[i]);
    });
  }
  // Now that we have that, we can start working on normalizing
  let pre = [];
  for (let i = 0; i < point.length; i++) {
    pre[i] = point[i] / math.max(adjpoints[i]);
  }
  // Now, we have the values from 0-1, but they aren't actually done yet.
  // Essentially, if the points are not a square, we will have issues. For example, with these points:
  // *---*
  // |     \
  // *-------*
  // the point (1,1)
  // would turn into (0.5, 1)
  // which will give the value at p:
  // *-p-*
  // |      \
  // *-------*
  // To fix this, we simply need to run the interpolation once, and multiply the normalized value by the actual pos divided
  // by the pos we get.
  // So for example, it would output (0.5,0.5,x), so 1/0.5=2. We multiply the 0.5 by 2 to get an *actual* normalized value
  // of 1, which gives us the result at p, here:
  // *---p
  // |     \
  // *-------*
  // Where it should be.
  let deltas = rlerp(2, points, pre, 0, lerp);
  console.log(deltas, point);
  let final = [];
  pre.forEach((val, i) => {
    final[i] = (point[i] / deltas[i]) * val;
  });
  return final;
}

export default {
  lerp,
  rlerp,
};
