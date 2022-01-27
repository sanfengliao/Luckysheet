import { Cell } from '../../../typing';
import { CellStatusUtil } from '../../../utils/cell';
import { getFontFormat } from '../../../utils/font';

export interface Options {
  cellWidth: number;
  cellHeight: number;
  spaceWidth: number;
  spaceHeight: number;
  r: number;
  c: number;
}

export function extractCellInfo(cell: Cell) {
  const horizontal = CellStatusUtil.getHorizontal(cell);
  // 垂直对齐
  const vertical = CellStatusUtil.getVertical(cell);
  const fontset = getFontFormat(cell);
  const underLine = CellStatusUtil.get(cell, 'un'); // underLine
  const cancelLine = CellStatusUtil.get(cell, 'cl');
  const fontSize = CellStatusUtil.getFontSize(cell);
  const textBreak = CellStatusUtil.getTextBreak(cell);
  const value = cell.m || cell.v || cell;

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
  const { cellWidth } = opts;
  let mode = '';
  // console.log("initialinfo", cell, option);
  if (!cellWidth) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mode = 'onlyWidth';
  }
};
