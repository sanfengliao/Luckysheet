
import { Cell, Horizontal, Vertical, TextBreak } from '../typing';
import { rgbTohex } from './color';
/**
 *
 * @param {string} color
 * @returns
 */
const toHex = (color: string) => {
  if (color.includes('rgba')) {
    return rgbTohex(color);
  }
  return color;
};
/**
 * 同checkstatusByCell功能
 */
export const CellStatusUtil = {
  getFontColor(cell: Cell) {
    const fontColor = cell.fc;
    if (!fontColor) {
      return '#000000';
    }
    return toHex(fontColor);
  },

  getBgColor(cell: Cell) {
    const bgColor = cell.bg;
    if (!bgColor) {
      return null;
    }
    return toHex(bgColor);
  },

  // 我也不知道下面两个是啥玩意
  /**
   *
   * @param {string} key
   * @returns {string}
   */
  getBs(cell: Cell, key: keyof Cell) {
    const bs = cell[key];
    return bs || 'none';
  },

  getBc(cell: Cell, key: keyof Cell) {
    const bs = cell[key];
    return bs || '#000000';
  },

  getHorizontal(cell: Cell): Horizontal {
    const ht = cell.ht as Horizontal;
    if (typeof ht === 'undefined') {
      return Horizontal.Left;
    }
    return [Horizontal.Left, Horizontal.Middle, Horizontal.Right].includes(Number(ht)) ? Number(ht) : Horizontal.Left;
  },

  getVertical(cell: Cell): Vertical {
    const vt = cell.vt;
    if (typeof vt === 'undefined') {
      return Vertical.Middle;
    }
    return [Vertical.Middle, Vertical.Top, Vertical.Bottom].includes(Number(vt)) ? Number(vt) : Vertical.Middle;
  },

  getCellType(cell: Cell) {
    return Number(cell.ct!) || 0;
  },

  getFontSize(cell: Cell) {
    return Number(cell.fs) || 10;
  },

  getTextBreak(cell: Cell): TextBreak {
    return Number(cell.tb) || 0;
  },

  get(cell: Cell, key: keyof Cell) {
    const tf = ['bl', 'it', 'ff', 'cl', 'un'];
    if (tf.includes(key) || (key === 'fs' && isInlineStringCell(cell))) {
      return Number(cell[key]) || 0;
    }
    return 0;
  }
}

export function isInlineStringCell(cell: Cell) {
  return cell && cell.ct && cell.ct.t === 'inlineStr' && cell.ct.s && cell.ct.s.length > 0;
}
