export const isUndef = (val: any) => val === undefined || val === null;

export const isObject = (val: any): val is object => typeof val === 'object' && val !== null;