import { extractCellInfo, Options } from '.';
import { Cell, Horizontal, RenderText, RenderTextValue, Vertical } from '../../../typing';
import { getMeasureText, getCancelLine, getUnderLine } from '../../../utils/text';

export function transformNormalTextCell(ctx: CanvasRenderingContext2D, cell: Cell, opts: Options) {
  const { cellHeight, cellWidth, spaceHeight, spaceWidth } = opts;
  const {
    horizontal,
    vertical,
    value,
    fontset,
    cancelLine,
    underLine,
    fontSize
  } = extractCellInfo(cell);
  const renderText = {
    values: []
  } as unknown as RenderText;
  ctx.textBaseline = 'alphabetic';

  const measureText = getMeasureText(ctx, value);
  const width = measureText.width;
  const height = measureText.actualBoundingBoxDescent + measureText.actualBoundingBoxAscent;

  // 如果字体旋转， 计算字体占用的宽高
  renderText.textWidthAll = width;
  renderText.textHeightAll = height;

  // 计算出旋转之后偏移的距离
  let left = spaceWidth; // 默认为1，左对齐
  if (horizontal === Horizontal.Middle) { // 居中对齐
    left = cellWidth / 2 - width / 2;
  } else if (horizontal === Horizontal.Right) { // 右对齐
    left = cellWidth - spaceWidth - width;
  }

  // 默认为2，下对齐
  let top = (cellHeight - spaceHeight) - measureText.actualBoundingBoxDescent;
  if (vertical === Vertical.Middle) {
    // 居中对齐
    top = cellHeight / 2 - height / 2 + measureText.actualBoundingBoxAscent;
  } else if (vertical === Vertical.Top) {
    // 上对齐
    top = spaceHeight + measureText.actualBoundingBoxAscent;
  }

  renderText.type = 'plain';
  renderText.textLeftAll = left;
  renderText.textTopAll = top;

  const wordGroup = {
    content: value,
    style: fontset,
    width,
    height,
    left,
    top,
  } as RenderTextValue;
  const decorateParam = {
    width: width,
    left: wordGroup.left,
    top: wordGroup.top,
    asc: measureText.actualBoundingBoxAscent,
    desc: measureText.actualBoundingBoxDescent,
    fontSize,
  }
  if (cancelLine) {
    wordGroup.cancelLine = getCancelLine(decorateParam)
  }
  wordGroup.underLine = getUnderLine(underLine, decorateParam);

  renderText.values.push(wordGroup);

  renderText.textLeftAll = left;
  renderText.textTopAll = top;

  renderText.asc = measureText.actualBoundingBoxAscent;
  renderText.desc = measureText.actualBoundingBoxDescent;
  return renderText;
}
