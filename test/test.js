import * as iterp from "../index.js";
import fs from "fs";
let log = "";

try {
  let lerpS = iterp.lerp(0.5, 0, 2);
  let lerpV = iterp.lerp(0.5, [0, 0], [2, 2]);
  log += `Lerp, scalar: ${lerpS}. Expected 1
Lerp, vector: ${lerpV}. Expected 1,1\n`;
  console.log(`Lerp, scalar: ${lerpS}. Expected 1
Lerp, vector: ${lerpV}. Expected 1,1`);
} catch (e) {
  log += e;
  console.log("ERROR IN LERP: ", e);
}

try {
  let rlerpS = iterp.riterp(1, [0, 2], [0.5], 0, iterp.lerp);
  let rlerpV = iterp.riterp(
    2,
    [
      [0, 0, 1],
      [1, 0, 2],
      [0, 1, 3],
      [1, 1, 4],
    ],
    [0.5, 0.5],
    0,
    iterp.lerp
  );
  log += `Recursive iterp, scalar: ${rlerpS}. Expected 1
Recursive iterp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`;
  console.log(`Recursive iterp, scalar: ${rlerpS}. Expected 1
Recursive iterp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`);
} catch (e) {
  log += e;
  console.log("ERROR IN RITERP: ", e);
}

try {
  let choice = iterp.choose(
    [0.5, 0.5],
    [
      [-1, -1, -3],
      [0, -1, -2],
      [-1, 0, -1],
      [0, 0, 0],
      [1, 0, 1],
      [0, 1, 2],
      [1, 1, 3],
    ]
  );
  log += `Choice: ${choice}. Expected 0,0,0,1,0,1,0,1,2,1,1,3`;
  console.log(`Choice: ${choice}. Expected 0,0,0,1,0,1,0,1,2,1,1,3`);
} catch (e) {
  log += e;
  console.log("ERROR IN CHOOSE: ", e);
}

try {
  let p = [1, 1];
  let points = [
    [0, 0, 0],
    [2, 0, 1],
    [0, 1, 2],
    [1, 1, 3],
  ];
  let norm = iterp.normalize(p, points);
  log += `Norm: ${norm}. Expected 1,1`;
  console.log(`Norm: ${norm}. Expected 1,1`);
} catch (e) {
  log += e;
  console.log("ERROR IN NORMALIZE: ", e);
}

try {
  let rlerpS = iterp.nlerp(1, [0, 2], [0.5], 0);
  let rlerpV = iterp.nlerp(
    2,
    [
      [0, 0, 1],
      [1, 0, 2],
      [0, 1, 3],
      [1, 1, 4],
    ],
    [0.5, 0.5]
  );
  log += `Nlerp, scalar: ${rlerpS}. Expected 1
Nlerp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`;
  console.log(`Nlerp, scalar: ${rlerpS}. Expected 1
Nlerp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`);
} catch (e) {
  log += e;
  console.log("ERROR IN Nlerp: ", e);
}

fs.writeFileSync("test/log.txt", log);
console.log("Log saved in test/log.txt");
