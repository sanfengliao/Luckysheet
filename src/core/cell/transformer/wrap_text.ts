import { extractCellInfo, Options } from '.';
import { Cell, Horizontal, RenderText, RenderTextValue, Vertical } from '../../../typing';
import { isUndef } from '../../../utils';
import { checkWordByteLength, getCancelLine, getMeasureText, getUnderLine } from '../../../utils/text';

export interface Style {
  fc: string;
  cl: number;
  un: number;
  fs: number;
  wrap?: boolean;
  fontset: string;
  v?: string;
  measureText?: TextMetrics;
}
export interface Char {
  content: string;
  style: string | Style;
  width: number;
  height: number;
  left: number;
  top: number;
  splitIndex: number;
  asc: number;
  desc: number;
  inline?: boolean;
  fs: number;
};

export type Line = Char[];

export function transformWrapTextCell(ctx: CanvasRenderingContext2D, cell: Cell, opts: Options) {
  const { spaceWidth, cellWidth, cellHeight, spaceHeight } = opts;
  const cellInfo = extractCellInfo(cell);
  let { value } = cellInfo;
  const { fontset, fontSize, horizontal, vertical, underLine, cancelLine } = cellInfo;
  value = value.toString();
  let i = 1;
  let anchor = 0;
  let preMeasureText: TextMetrics;
  let preTextWidth = 0;
  let preTextHeight = 0;
  let spaceOrTwoByte: any;
  let preStr = '';
  let splitIndex = 0;
  const lineList: Line[] = [];
  const textContent = {} as RenderText;
  textContent.values = [];
  let totalTextWidth = 0;
  let totalTextHeight = 0;

  // 将文字切分成行
  while (i <= value.length) {
    const str = value.substring(anchor, i);
    const measureText = getMeasureText(ctx, str);
    const width = measureText.width;
    const height = measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent;

    preMeasureText = measureText;
    const lastWord = str.substr(str.length - 1, 1);
    if (lastWord === ' ' || checkWordByteLength(lastWord) === 2) {
      if (preMeasureText) {
        spaceOrTwoByte = {
          index: i,
          str: preStr + lastWord,
          width: preTextWidth,
          height: preTextHeight,
          asc: preMeasureText.actualBoundingBoxAscent,
          desc: preMeasureText.actualBoundingBoxDescent,
        };
      }
    }
    if ((width + spaceWidth) > cellWidth && lineList[splitIndex] && i !== value.length) {
      // 在空格或者两个字符的位置进行切分
      if (!isUndef(spaceOrTwoByte) && spaceOrTwoByte.index < i) {
        anchor = spaceOrTwoByte.index;

        i = anchor + 1;

        lineList[splitIndex].push({
          content: spaceOrTwoByte.str,
          style: fontset,
          width: spaceOrTwoByte.width,
          height: spaceOrTwoByte.height,
          left: 0,
          top: 0,
          splitIndex: splitIndex,
          asc: spaceOrTwoByte.asc,
          desc: spaceOrTwoByte.desc,
          fs: fontSize,
        });
        splitIndex += 1;
        spaceOrTwoByte = null;
      } else {
        spaceOrTwoByte = null;
        anchor = i - 1;
        lineList[splitIndex].push({
          content: preStr,
          style: fontset,
          width: preTextWidth,
          height: preTextHeight,
          left: 0,
          top: 0,
          splitIndex: splitIndex,
          asc: measureText.actualBoundingBoxAscent,
          desc: measureText.actualBoundingBoxDescent,
          fs: fontSize,
        });
        splitIndex += 1;
      }
    } else if (i === value.length) {
      if (!lineList[splitIndex]) {
        lineList[splitIndex] = [];
      }
      lineList[splitIndex].push({
        content: str,
        style: fontset,
        width,
        height,
        left: 0,
        top: 0,
        splitIndex: splitIndex,
        asc: measureText.actualBoundingBoxAscent,
        desc: measureText.actualBoundingBoxDescent,
        fs: fontSize,
      });

      break;
    } else {
      if (isUndef(lineList[splitIndex])) {
        lineList[splitIndex] = [];
      }
      i++;
    }
    preStr = str;
    preTextHeight = height;
    preTextWidth = width;
    preMeasureText = measureText;
  }

  const lineSizeList: any[] = [];
  let maxWordCountOfOneLine = 0;
  const supportBoundBox = isSupportBoundingBox(ctx);
  lineList.forEach(line => {
    if (!line) {
      return;
    }
    let width = 0;
    let height = 0;
    let desc = 0;
    let asc = 0;
    let wordCount = 0;

    line.forEach(sp => {
      width += sp.width;
      height = Math.max(height, sp.height);
      desc = Math.max(desc, (supportBoundBox ? sp.desc : 0));
      asc = Math.max(asc, sp.asc);
      wordCount++;
    })
    maxWordCountOfOneLine = Math.max(maxWordCountOfOneLine, wordCount);
    totalTextWidth = Math.max(totalTextWidth, width);
    totalTextHeight += height;

    lineSizeList.push({
      width,
      height,
      desc,
      asc,
      wordCount,
    });
  })

  textContent.textWidthAll = totalTextWidth;
  textContent.textHeightAll = totalTextHeight;

  // TODO
  // if (isMode == 'onlyWidth') {
  //   // console.log("plainWrap", textContent,cell, option);
  //   return textContent;
  // }
  let preTotalHeight = 0;
  let preTotalWidth = 0;
  lineList.forEach((line, i) => {
    const size = lineSizeList[i];

    preTotalWidth = 0;

    for (let c = 0; c < line.length; c++) {
      const wordGroup = line[c] as RenderTextValue;
      let left, top;
      // 左对齐 所有文字横坐标的起始位置=spaceWidth
      left = spaceWidth + preTotalWidth;
      if (horizontal === Horizontal.Middle) {
        // 所有文字横坐标的起始位置=cellWidth / 2 - size.width / 2
        left = cellWidth / 2 - size.width / 2 + preTotalWidth;
      } else if (horizontal === Horizontal.Right) {
        // 所有文字的起始位置cellWidth - spaceWidth - size.width
        left = cellWidth - spaceWidth - size.width + preTotalWidth;
      }

      // 底部对其 所有文字的纵坐标起始位置=cellHeight - spaceHeight - totalTextHeight
      top = (cellHeight - spaceHeight - totalTextHeight) + preTotalHeight + size.asc;
      if (vertical === Vertical.Middle) {
        // 所有文字的纵坐标的起始位置=cellHeight / 2 - totalTextHeight / 2
        top = cellHeight / 2 - totalTextHeight / 2 + preTotalHeight + size.asc;
      } else if (vertical === Vertical.Top) {
        // 所有文字的所有文字的纵坐标起始位置= spaceHeight
        top = spaceHeight + preTotalHeight + size.asc;
      }
      const decorateParam = {
        width: wordGroup.width,
        left: wordGroup.left,
        top: wordGroup.top,
        asc: size.asc,
        desc: size.desc,
        fontSize,
      }
      if (cancelLine) {
        wordGroup.cancelLine = getCancelLine(decorateParam)
      }
      wordGroup.underLine = getUnderLine(underLine, decorateParam);

      wordGroup.left = left;
      wordGroup.top = top;

      textContent.values.push(wordGroup);

      preTotalWidth += wordGroup.width;
    }

    preTotalHeight += size.height;
  })

  textContent.type = 'plainWrap';
  return textContent;
}

function isSupportBoundingBox(ctx: CanvasRenderingContext2D) {
  const measureText = ctx.measureText('田');
  if (measureText.actualBoundingBoxAscent == null) {
    return false;
  }
  return true;
}
