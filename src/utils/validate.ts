
const patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
export function hasChinaword(s: string) {
  return patrn.test(s);
}
