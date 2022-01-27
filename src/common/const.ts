
import locale from '../locale/locale';
import Store from '../store';

export const getDefaultFont = function() {
  return `normal normal normal ${Store.defaultFontSize}pt ${locale().fontarray[0]}, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC",  "WenQuanYi Micro Hei", sans-serif`;
}
