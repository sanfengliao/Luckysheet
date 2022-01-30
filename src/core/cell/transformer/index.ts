import { Cell, Horizontal, TextBreak, Underline, Vertical } from '../../../typing';
import { CellStatusUtil, isInlineStringCell } from '../../../utils/cell';
import { getFontFormat } from '../../../utils/font';
import { transformInlineTextCell } from './inline_text';
import { transformNormalTextCell } from './normal_text';
import { transformWrapTextCell } from './wrap_text';

export interface Options {
  cellWidth: number;
  cellHeight: number;
  spaceWidth: number;
  spaceHeight: number;
  r: number;
  c: number;
}

export interface CellInfo {
  horizontal: Horizontal;
  vertical: Vertical;
  value: string;
  fontSize: number;
  fontset: string;
  underLine: Underline;
  cancelLine: number;
  textBreak: TextBreak;
}

export function extractCellInfo(cell: Cell): CellInfo {
  const horizontal = CellStatusUtil.getHorizontal(cell);
  // 垂直对齐
  const vertical = CellStatusUtil.getVertical(cell);
  const fontset = getFontFormat(cell);
  const underLine = CellStatusUtil.get(cell, 'un'); // underLine
  const cancelLine = CellStatusUtil.get(cell, 'cl');
  const fontSize = CellStatusUtil.getFontSize(cell);
  const textBreak = CellStatusUtil.getTextBreak(cell);
  const value = cell.m?.v || cell.v || cell;

  return {
    horizontal,
    vertical,
    value,
    fontSize,
    fontset,
    underLine,
    cancelLine,
    textBreak,
  }
}

export const transformCell2RenderText = (ctx: CanvasRenderingContext2D, cell: Cell, opts: Options) => {
  const { cellWidth, cellHeight, spaceWidth = 2, spaceHeight = 2, r, c } = opts;
  let mode = '';
  // console.log("initialinfo", cell, option);
  if (!cellWidth) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mode = 'onlyWidth';
  }
  const transformOpts = {
    cellWidth,
    cellHeight,
    spaceHeight,
    spaceWidth,
    r,
    c,
  }
  if (isInlineStringCell(cell)) {
    return transformInlineTextCell(ctx, cell, transformOpts);
  }

  if (cell.tb === TextBreak.Wrap) {
    return transformWrapTextCell(ctx, cell, transformOpts);
  }
  return transformNormalTextCell(ctx, cell, transformOpts);
};
