import { extractCellInfo, Options } from '.';
import { Cell, TextBreak, Underline } from '../../../typing';
import { getFontFormat } from '../../../utils/font';
import { checkWordByteLength, getMeasureText } from '../../../utils/text';
import { Line, StyleChar, transformLineListToTextCell } from './wrap_text';

function getCharList(cell: Cell) {
  const sharedStrings = cell.ct!.s;
  let similarIndex = 0;
  const result: StyleChar[] = [];
  function addToResult({
    fontset,
    fc = '#000',
    cl = 0,
    un = 0,
    fs = 11,
    si,
    v,
    wrap,
  }: {
    fontset: string;
    fc?: string;
    cl?: number;
    un?: Underline;
    v?: string;
    fs?: number;
    si?: number,
    wrap?: boolean;
  }) {
    result.push({
      fontset,
      fc,
      cl,
      un,
      v,
      si,
      fs,
      wrap,
    });
  }
  sharedStrings.forEach(shareCell => {
    const fontset = getFontFormat(shareCell);
    let v = shareCell.v;
    const { fs, un, fc, cl } = shareCell;
    const commonStyle = { fs, un, fc, cl, fontset }
    // 换行
    v = v.replace(/\r\n/g, '_x000D_').replace(/&#13;&#10;/g, '_x000D_').replace(/\r/g, '_x000D_').replace(/\n/g, '_x000D_');
    const splitArr = v.split('_x000D_');

    for (let x = 0; x < splitArr.length; x++) {
      const newValue = splitArr[x];

      if (newValue === '' && x !== splitArr.length - 1) {
        addToResult({
          wrap: true,
          ...commonStyle,
        });
        similarIndex++;
      } else {
        const newValueArray = newValue.split('');
        for (let n = 0; n < newValueArray.length; n++) {
          const nv = newValueArray[n];

          addToResult({
            v: nv,
            si: similarIndex,
            ...commonStyle,
          })
        }

        if (x !== splitArr.length - 1) {
          addToResult({
            wrap: true,
            ...commonStyle,
          });
          similarIndex++;
        }
      }
    }
    similarIndex++;
  })
  return result;
}

export function transformInlineTextCell(ctx: CanvasRenderingContext2D, cell: Cell, opts: Options) {
  const inlineStringArr = getCharList(cell);
  const { cellWidth, spaceWidth } = opts;
  let splitIndex = 0;
  const lineList: Line[] = [];
  const cellInfo = extractCellInfo(cell);
  const tb = cellInfo.textBreak;

  let anchor = 0; let i = 1;
  let spaceOrTwoByteIndex: any;
  while (i <= inlineStringArr.length) {
    const shareCells = inlineStringArr.slice(anchor, i);
    if (shareCells[shareCells.length - 1].wrap === true) {
      anchor = i;

      if (shareCells.length > 1) {
        for (let s = 0; s < shareCells.length - 1; s++) {
          const sc = shareCells[s]!;
          const item = {
            content: sc.v!,
            style: sc,
            width: sc.measureText!.width,
            height: sc.measureText!.actualBoundingBoxAscent + sc.measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex: splitIndex,
            asc: sc.measureText!.actualBoundingBoxAscent,
            desc: sc.measureText!.actualBoundingBoxDescent,
            inline: true,
            fs: sc.fs
          }

          lineList[splitIndex].push(item);
        }
      }

      if (shareCells.length === 1 || i === inlineStringArr.length) {
        const sc = shareCells[0];
        const measureText = getMeasureText(ctx, 'M', sc.fontset);
        if (lineList[splitIndex] == null) {
          lineList[splitIndex] = [];
        }
        lineList[splitIndex].push({
          content: '',
          style: sc,
          width: measureText.width,
          height: measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent,
          left: 0,
          top: 0,
          splitIndex: splitIndex,
          asc: measureText.actualBoundingBoxAscent,
          desc: measureText.actualBoundingBoxDescent,
          inline: true,
          wrap: true,
          fs: sc.fs
        });
      }

      splitIndex += 1;

      i++;

      continue;
    }

    let width = 0;
    for (let s = 0; s < shareCells.length; s++) {
      const sc = shareCells[s];
      if (sc.measureText == null) {
        sc.measureText = getMeasureText(ctx, sc.v!, sc.fontset);
      }
      width += sc.measureText.width;
    }

    const lastWord = shareCells[shareCells.length - 1];
    if (lastWord.v === ' ' || checkWordByteLength(lastWord.v!) === 2) {
      spaceOrTwoByteIndex = i;
    }
    if ((width + spaceWidth) > cellWidth && lineList[splitIndex] && tb === TextBreak.Wrap && i !== inlineStringArr.length) {
      if (spaceOrTwoByteIndex != null && spaceOrTwoByteIndex < i) {
        for (let s = 0; s < spaceOrTwoByteIndex - anchor; s++) {
          const sc = shareCells[s]!;
          lineList[splitIndex].push({
            content: sc.v!,
            style: sc,
            width: sc.measureText!.width,
            height: sc.measureText!.actualBoundingBoxAscent + sc.measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex: splitIndex,
            asc: sc.measureText!.actualBoundingBoxAscent,
            desc: sc.measureText!.actualBoundingBoxDescent,
            inline: true,
            fs: sc.fs
          });
        }
        anchor = spaceOrTwoByteIndex;

        i = spaceOrTwoByteIndex + 1;

        splitIndex += 1;

        spaceOrTwoByteIndex = null;
      } else {
        anchor = i - 1;

        for (let s = 0; s < shareCells.length - 1; s++) {
          const sc = shareCells[s];
          lineList[splitIndex].push({
            content: sc.v!,
            style: sc,
            width: sc.measureText!.width,
            height: sc.measureText!.actualBoundingBoxAscent + sc.measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex: splitIndex,
            asc: sc.measureText!.actualBoundingBoxAscent,
            desc: sc.measureText!.actualBoundingBoxDescent,
            inline: true,
            fs: sc.fs
          });
        }

        splitIndex += 1;
      }
    } else if (i === inlineStringArr.length) {
      if (lineList[splitIndex] == null) {
        lineList[splitIndex] = [];
      }

      for (let s = 0; s < shareCells.length; s++) {
        const sc = shareCells[s];
        lineList[splitIndex].push({
          content: sc.v!,
          style: sc,
          width: sc.measureText!.width,
          height: sc.measureText!.actualBoundingBoxAscent + sc.measureText!.actualBoundingBoxDescent,
          left: 0,
          top: 0,
          splitIndex: splitIndex,
          asc: sc.measureText!.actualBoundingBoxAscent,
          desc: sc.measureText!.actualBoundingBoxDescent,
          inline: true,
          fs: sc.fs
        });
      }

      break;
    } else {
      if (lineList[splitIndex] == null) {
        lineList[splitIndex] = [];
      }
      i++;
    }
  }

  return transformLineListToTextCell({
    ctx,
    opts,
    cellInfo,
    lineList
  });
};
