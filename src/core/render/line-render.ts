import { RenderLine } from "../../typing";

export const renderLine = (ctx: CanvasRenderingContext2D, line: RenderLine) => {
  const { start, end, style, width } = line;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineWidth = width;
  ctx.strokeStyle = style;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}