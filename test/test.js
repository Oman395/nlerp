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
  let rlerpS = iterp.rlerp(1, [0, 2], [0.5], 0, iterp.lerp);
  let rlerpV = iterp.rlerp(
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
  log += `Recursive lerp, scalar: ${rlerpS}. Expected 1
Recursive lerp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`;
  console.log(`Recursive lerp, scalar: ${rlerpS}. Expected 1
Recursive lerp, vector: ${rlerpV}. Expected 0.5,0.5,2.5`);
} catch (e) {
  log += e;
  console.log("ERROR IN RLERP: ", e);
}

fs.writeFileSync("test/log.txt", log);
console.log("Log saved in test/log.txt");
