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
  cancelLine: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fs: number;
  }
  underLine?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fs: number;
  }[]
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