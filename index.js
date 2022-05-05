import * as math from "mathjs";

// The formula I'm following is from here:
// https://pimiddy.wordpress.com/2011/01/20/n-dimensional-interpolation/
// Whoever wrote it is smarter than me, I've been trying to figure out how to do this for way too long

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

export default {
  lerp,
  rlerp,
};
