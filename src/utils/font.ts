import { isObject } from '.';
import { getDefaultFont } from '../common/const';
import menuButton from '../controllers/menuButton';
import locale from '../locale/locale';
import Store from '../store';
import { Cell } from '../typing';
import { isDataTypeMulti } from './date';

// 获取字体配置
export function getFontFormat(cell: Cell) {
  const fontarray = locale().fontarray;
  if (isObject(cell)) {
    let font = '';

    // 斜体
    if (!cell.it) {
      font += 'normal ';
    } else {
      font += 'italic ';
    }

    font += 'normal ';

    // font-weight 粗体
    if (!cell.bl) {
      font += 'normal ';
    } else {
      font += 'bold ';
    }

    // font-size/line-height
    if (!cell.fs) {
      font += `${Store.defaultFontSize}pt `;
    } else {
      font += `${Math.ceil(cell.fs)}pt `;
    }

    if (!cell.ff) {
      font += `${fontarray[0]}, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif`;
    } else {
      let fontfamily = null;
      if (isDataTypeMulti(cell.ff).num) {
        fontfamily = fontarray[parseInt(cell.ff)];
      } else {
        // fontfamily = fontarray[fontjson[format.ff]];
        fontfamily = cell.ff;

        fontfamily = fontfamily.replace(/"/g, '').replace(/'/g, '');

        if (fontfamily.indexOf(' ') > -1) {
          fontfamily = `"${fontfamily}"`;
        }

        if (fontfamily != null && document.fonts && !document.fonts.check(`12px ${fontfamily}`)) {
          menuButton.addFontTolist(fontfamily);
        }
      }

      if (fontfamily == null) {
        fontfamily = fontarray[0];
      }

      font += `${fontfamily}, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif`;
    }

    return font;
  }

  return getDefaultFont();
}
