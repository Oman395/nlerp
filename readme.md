# N dimensional linear interpolation

I was working on Q learning, and I encountered a minor roadblock-- in a situation with a ton of possible states, it would not be feasable to simply store every state. Thus, I started working on this.

This package is based around an [article](https://pimiddy.wordpress.com/2011/01/20/n-dimensional-interpolation/) by pimiddy. Honestly, I tried to figure out how to do it on my own, but I really just couldn't figure out how. It turned out I was looking at the problem wrong; rather than using squares, cubes, hypercubes, etc, I was using triangles. Switching to building it from triangles to squares made everything a lot easier.

This package runs at roughly 2^n, where n is the number of dimensions that you are using. I'm working on optimization but I really doubt I could get the big O down, at least with my current math knowledge.

Ramble aside, here's some half-decent docs.

## Documentation

### nlerp

This function is the core of the package, allowing for full n-dimensional linear interpolation (now without recursion!). It's only real drawback is that it cannot function for anything other than linear interpolation, so if you plan on using quadratic or other methods, use the riterp function.

#### Parameters

1. Dimensions - Number of dimensions (i.e. 2 for square, 3 for cube, etc). Used for detecting invalid inputs.
2. Values - 2^Dimensions array of values to interpolate between. Values can be integers or arrays, as long as they are valid for mathjs' `math.multiply` function.
3. Position - Array of integers, 0-1, representing the position. Length must equal Dimensions.

#### Example

```js
import { nlerp } from "nlerp";

let vals = [
  // 2d
  [0, 0, 0],
  [1, 0, 1],
  [0, 1, 2],
  [1, 1, 3],
];
let point = [0.5, 0.5];
let result = nlerp(2, vals, point); // Should be 0.5,0.5,2.5
```

### riterp

This function allows for n-dimensional interpolation with any method, and as such provides some utility; however, if you plan to use linear interpolation, use the nlerp function; it is significantly faster.

#### Parameters

1. Dimensions - Number of dimensions (i.e. 2 for square, 3 for cube, etc)
2. Values - 2^Dimensions array of values to interpolate between. Values can be integers or arrays, as long as they are valid for mathjs' `math.multiply` function.
3. Position - Array of integers, 0-1, representing the position. Length must equal Dimensions.
4. i - Set this to 0. Used internally.
5. Function - Base interpolation function. Parameters must be (x, val0, val1). If you don't have an interpolation function, use the lerp function in this package.

#### Example

```js
import { niterp, lerp } from "nlerp";

let vals = [
  // 2d
  [0, 0, 0],
  [1, 0, 1],
  [0, 1, 2],
  [1, 1, 3],
];
let point = [0.5, 0.5];
let result = niterp(2, vals, point, 0, lerp); // Should be 0.5,0.5,2.5
```

### lerp

The lerp function is the base linear interpolation function used in the package. It is advisable to use this with the rlerp function.

#### Parameters

1. X - The value, 0-1, to use for interpolation.
2. A - The value to be 1 at x=0
3. B - The value to be 1 at x=1

#### Example

```js
import { lerp } from "nlerp";

let x = 0.5;
let a = 0;
let b = 2;
let result = lerp(x, a, b); // Should be 1
```

### Normalize

The normalize function is used for taking a point and normalizing the coordinates to 0-1 for use with the rlerp function.

#### Parameters

1. Point - The point to normalize.
2. Points - The array of points that will be used in the rlerp function.

#### Example

```js
import { lerp, rlerp, normalize } from "nlerp";

let points = [
  [0, 0, 0],
  [1, 0, 1],
  [0, 1, 2],
  [1, 1, 3],
];
let point = [0.5, 0.5];
let result = rlerp(2, points, normalize(point, points), 0, lerp);
```

### Choose

This is used for choosing which points to interpolate between. If you have 100 points, you need to find which ones to pass to the rlerp function; this will do that for you.

It's worth noting that if the x/y value of a point equals the x/y value of a point in the array, it will default low. This means that if you had a point like (1,1), and an array of points like [(0,0), (1,0), (0,1), (1,1)], it would fail, as it would only find (1,1) as the bottom left and nothing else.

#### Parameters

1. Point - The point that will be interpolated.
2. Points - The array of points to choose from.

#### Example

```js
import { lerp, rlerp, choose } from "nlerp";

let points = [
  [-1, -1, -3],
  [0, -1, -2],
  [-1, 0, -1],
  [0, 0, 0],
  [1, 0, 1],
  [0, 1, 2],
  [1, 1, 3],
];
let point = [0.5, 0.5];
let choice = choose(point, points); // Should be [0,0,0],[1,0,1],[0,1,2],[1,1,3]
let result = rlerp(2, points, point, 0, lerp);
```
