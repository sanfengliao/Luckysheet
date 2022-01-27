/* eslint-disable comma-dangle */
import dayjs from 'dayjs'
import { hasChinaword } from './validate';

function isDateTime(date: string) {
  if (date == null || date.toString().length < 5) {
    return false;
  }
  if (checkDateTime(date,)) {
    return true;
  }
  return false;
}

function checkDateTime(date: string) {
  const reg1 = /^(\d{4})-(\d{1,2})-(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;
  const reg2 = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;

  if (!reg1.test(date) && !reg2.test(date)) {
    return false;
  }

  const year = parseInt(RegExp.$1);
  const month = parseInt(RegExp.$2);
  const day = parseInt(RegExp.$3);

  if (year < 1900) {
    return false;
  }

  if (month > 12) {
    return false;
  }

  if (day > 31) {
    return false;
  }

  if (month === 2) {
    if (new Date(year, 1, 29).getDate() === 29 && day > 29) {
      return false;
    } else if (new Date(year, 1, 29).getDate() !== 29 && day > 28) {
      return false;
    }
  }

  return true;
}

function diff(now: number, then: number) {
  return dayjs(now).diff(dayjs(then));
}

function isDataTypeMulti(s: string) {
  const type = {} as {date: boolean; num: boolean};

  if (isDateTime(s)) {
    type.date = true;
  }

  if (!isNaN(parseFloat(s)) && !hasChinaword(s)) {
    type.num = true;
  }

  return type;
}

function isDateType(s: string) {
  let type = 'string';

  if (isDateTime(s)) {
    type = 'date';
  } else if (!isNaN(parseFloat(s)) && !hasChinaword(s)) {
    type = 'num';
  }

  return type;
}

export {
  isDateTime,
  diff,
  isDataTypeMulti,
  isDateType,
}
