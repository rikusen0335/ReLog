// api/ogi.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, registerFont } from "canvas";
import { resolve } from "path";
import { COOL_SITE_NAME } from "../../lib/constants";

const createOgi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const title = "あいうえおかきくけこTypeScriptのうんこの仕方" // String(req.query.title);
  const WIDTH = 1200 as const;
  const HEIGHT = 630 as const;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  registerFont(resolve("./fonts/NotoSansJP-Regular.otf"), {
    family: "Noto",
    weight: "400",
  });
  registerFont(resolve("./fonts/NotoSansJP-Bold.otf"), {
    family: "Noto",
    weight: "bold",
  });

  const LETTER_LIMIT: number = 12; // 13文字ごとに改行する
  const splittedTitle: string[] = [];
  for (let i = 0; i < title.length / LETTER_LIMIT; i++) {
    splittedTitle.push(title.substr(i * LETTER_LIMIT, LETTER_LIMIT));
  }
  const canvasTitle = splittedTitle.join("\n")

  // Background
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Blog title
  ctx.font = "70px Noto";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(canvasTitle, 100, 200);

  // Site name
  ctx.font = "bold 60px Segoe UI"
  ctx.textAlign = "center";
  ctx.fillText(COOL_SITE_NAME, 980, 550)

  // Divide Line
  let linePositionY: number = 280 + splittedTitle.length * 70
  console.log(linePositionY)
  ctx.fillStyle = "#111";
  ctx.fillRect(100, linePositionY, 700, 10);

  // Save them
  const buffer = canvas.toBuffer();
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": buffer.length,
  });
  res.end(buffer, "binary");
}

export default createOgi;
