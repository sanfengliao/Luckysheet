import Store from "../store";
import { RenderText } from "../typing";
import { isObject, isUndef } from "../utils";
import { renderLine } from "./line-render";


export interface Options {
  posX: number;
  posY: number;
}
export function renderText(ctx: CanvasRenderingContext2D, text: RenderText, options: Options) {
  const { values } = text;
  if (isUndef(values)) {
    return;
  }
  ctx.save();

  const { posX, posY } = options;


  values.forEach(word => {
    const { inline, style, content, left, top, underLine, cancelLine } = word;
    if (inline && isObject(style)) {
      ctx.font = style.fontset;
      ctx.fillStyle = style.fc;
    } else {
      ctx.font = style as string;
    }

    const text = isObject(content) ? content.m : content;
    ctx.fillText(text, (posX + left) / Store.zoomRatio, (posY + top) / Store.zoomRatio);
  
    if (cancelLine) {
      const { startX, startY, endX, endY, fs } = cancelLine;
      renderLine(ctx, {
        style: ctx.fillStyle as string,
        width: Math.floor(fs / 9),
        start: {
          x: getPosVal(posX, startX),
          y: getPosVal(posY, startY),
        },
        end: {
          x: getPosVal(posX, endX),
          y: getPosVal(posY, endY),
        }
      })
    }

    if (underLine) {
      underLine.forEach(u => {
        const { startX, startY, endX, endY, fs } = u;
        renderLine(ctx, {
          style: ctx.fillStyle as string,
          width: Math.floor(fs / 9),
          start: {
            x: getPosVal(posX, startX),
            y: getPosVal(posY, startY),
          },
          end: {
            x: getPosVal(posX, endX),
            y: getPosVal(posY, endY),
          }
        });å
      });
    }
  })

  ctx.restore();
}


const getPosVal = (pos: number, offset: number) => Math.floor((pos + offset) / Store.zoomRatio) + 0.5;