// 颜色 16进制转rgb
export function hexToRgb(hex: string) {
  const rgb = [];
  hex = hex.replace(/#/, '');

  if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
    const tmp = [];

    for (let i = 0; i < 3; i++) {
      tmp.push(hex.charAt(i) + hex.charAt(i));
    }

    hex = tmp.join('');
  }

  for (let i = 0; i < 3; i++) {
    rgb.push(parseInt(Number(`0x${hex.substr(i + 2, 2)}`) as unknown as string));
  }

  return `rgb(${rgb.join(',')})`;
};

// 颜色 rgb转16进制
export function rgbTohex(color: string) {
  let rgb;

  if (color.indexOf('rgba') > -1) {
    rgb = color.replace('rgba(', '').replace(')', '').split(',');
  } else {
    rgb = color.replace('rgb(', '').replace(')', '').split(',');
  }

  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);

  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  return hex;
};
