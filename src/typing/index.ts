export interface DecorateLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  fs: number;
}
export interface RenderTextValue {
  content: string | {
    m: string;
  };
  height: number;
  left: number;
  top: number;
  width: number;
  style: string | {
    fontset: string;
    fc: string;
  };
  inline: boolean;
  cancelLine?: DecorateLine;
  underLine?: DecorateLine[]
}
export interface RenderText {
  values: RenderTextValue[];
  asc?: number;
  desc?: number;
  rotate: number;
  textHeightAll: number;
  textLeftAll: number;
  textTopAll: number;
  textWidthAll: number;
  type: string;
}

export interface Pos {
  x: number;
  y: number;
}

export interface RenderLine {
  start: Pos;
  end: Pos;
  style: string;
  width: number;
}

export const enum Horizontal {
  Middle = 0,
  Left = 1,
  Right = 2,
}

export const enum Vertical {
  Middle = 0,
  Top = 1,
  Bottom = 2,
}

export const enum TextBreak {
  Truncated = 0,
  Overflow = 1,
  Wrap = 2,
}

export interface CellType {
  fa: string;
  t: 'inlineStr' | string;
  s: {
    ff: string;
    fc: string;
    fs: number;
    cl: number;
    un: number;
    bl: number;
    it: number;
    v: string;
  }[]
}

export type UnderlineType = 0 | 1 | 2 | 3 | 4

export const enum Underline {
  None = 0,
  Bottom = 1,
  BottomAndDesc,
  BottomDesc,
  BottomDesc2
}

export interface Cell {
  fc?: string;
  bg?: string;
  ht?: Horizontal;
  vt?: Vertical;
  ct?: CellType;
  fs?: number;
  tb?: TextBreak;
  rt?: string | number;
  m?: any;
  v?: any;
  un?: UnderlineType,
  cl?: 0 | 1;
  it?: number;
  bl?: number;
  ff?: string;
};
