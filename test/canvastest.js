import canvas from "canvas";
import fs from "fs";
import iterp from "../index.js";

const c = canvas.createCanvas(1000, 1000);
const ctx = c.getContext("2d");

const map = [
  [0, 0, 255, 0, 0],
  [1, 0, 0, 255, 0],
  [0, 1, 0, 0, 255],
  [1, 1, 255, 255, 255],
];
let log = "";
for (let x = 0; x < c.width; x++) {
  console.log(`${Math.floor((x / c.width) * 100)}%`);
  for (let y = 0; y < c.height; y++) {
    let val = iterp.rlerp(2, map, [x / c.width, y / c.height], 0, iterp.lerp);
    ctx.fillStyle = `rgb(${Math.floor(val[2])},${Math.floor(
      val[3]
    )},${Math.floor(val[4])})`;
    ctx.fillRect(x, y, 1, 1);
    if (y % 100 == 0)
      log +=
        val +
        ` rgb(${Math.floor(val[2] * 100) / 100},${
          Math.floor(val[3] * 100) / 100
        },${Math.floor(val[4] * 100) / 100}) ` +
        "\n";
  }
}

c.toBuffer((err, data) => {
  if (err) {
    throw err;
  }
  fs.writeFileSync("out.png", data);
  fs.writeFileSync("logC.txt", log);
});
