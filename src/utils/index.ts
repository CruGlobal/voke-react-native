import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import range from 'lodash/range';
import orderBy from 'lodash/orderBy';
import memoize from 'lodash/memoize';
import uniqBy from 'lodash/uniqBy';
import xor from 'lodash/xor';
import upperCase from 'lodash/upperCase';
// import clone from 'lodash/clone';
import difference from 'lodash/difference';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import Orientation from 'react-native-orientation-locker';

export {
  difference,
  memoize,
  orderBy,
  range,
  debounce,
  throttle,
  xor,
  uniqBy,
  upperCase,
};

export function youtubeParser(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

export const isEqualObject = (a, b) => {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

export const toCamelCase = str =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
      idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase(),
    )
    .replace(/\s+/g, '');

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isFunction = fn => typeof fn === 'function';
export const isArray = arr => Array.isArray(arr);
export const isObject = obj => typeof obj === 'object' && !isArray(obj);
export const isString = str => typeof str === 'string';
export const isNumber = n => typeof n === 'number';
export const exists = v => typeof v !== 'undefined';
export const isObjectEmpty = o =>
  Object.entries(o).length === 0 && o.constructor === Object;
export const clone = obj => (!obj ? obj : JSON.parse(JSON.stringify(obj)));
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export const sum = arr => arr.reduce((a, b) => a + b, 0);
export const uniqArr = arr => [...new Set(arr)];
export const formatNumber = num =>
  !Number.isNaN(Number(num)) ? Number(num).toLocaleString() : num;
export const randomBetween = (a, b) => Math.floor(Math.random() * (b - a)) + a;
export const randomStr = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

export function validateDate(dateStr) {
  const regExp = /^(\d\d?)\/(\d\d?)\/(\d{4})$/;
  const matches = dateStr.match(regExp);
  const maxDate = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let isValid = false;

  if (matches) {
    const month = parseInt(matches[1]);
    const date = parseInt(matches[2]);
    const year = parseInt(matches[3]);

    isValid = month <= 12 && month > 0;
    isValid = isValid && date <= maxDate[month] && date > 0;

    const leapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    isValid = isValid && (month !== 2 || leapYear || date <= 28);
  }

  return isValid;
}

export function validateEmail(email) {
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEX.test(String(email).toLowerCase());
}

export const customMemoResolver = (...args) => JSON.stringify(args);
export const arrToObj = memoize(
  (array, key = 'id') =>
    (array || []).reduce((obj, item) => {
      obj[item[key]] = item;
      return obj;
    }, {}),
  customMemoResolver,
);

export const objToArr = memoize((obj, sortOptions) => {
  let arr = Object.values(obj || {});
  if (sortOptions) {
    const sortField = sortOptions.sortField || 'id';
    if (sortOptions.sortBy === 'DESC') {
      arr = orderBy(arr, sortField, 'desc');
    } else {
      arr = orderBy(arr, sortField, 'asc');
    }
  }
  return arr;
}, customMemoResolver);

export function changeArrSize(arr, newSize, defaultValue) {
  return range(newSize).map((a, i) => {
    if (arr[i]) return arr[i];
    if (isFunction(defaultValue)) return defaultValue(i);
    return defaultValue;
  });
}
export async function asyncForEach(arr, callback) {
  for (let i = 0, l = arr.length; i < l; i++) {
    await callback(arr[i], i, arr);
  }
}
export function formatSelect(arr) {
  return (arr || []).map(a => ({ label: a, value: a }));
}
export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function plural(valOrArr, customEnding) {
  if (isArray(valOrArr)) {
    return valOrArr.length === 1 ? '' : customEnding || 's';
  }
  return valOrArr === 1 ? '' : customEnding || 's';
}
export function ellipsisUtil(str, len) {
  let q = str || '';
  q = q.length > len ? q.substr(0, len).trim() + '...' : q;
  return q;
}

/**
 * React lifecycle hook that calls a function after the component is mounted.
 * @param {*} cb
 */
export function useMount(cb) {
  useEffect(cb, []);
}

// Pull dates out of UTC format into a moment object
export const UTC_FORMAT = 'YYYY-MM-DD HH:mm:ss UTC';
export const momentUtc = time => moment.utc(time, UTC_FORMAT);

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && delay !== -1) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useKeyboard(callback) {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        callback(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        callback(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
}

export function lockToPortrait() {
  Orientation.lockToPortrait();
}

export function registerLogs() {
  const ENABLE_LOGS = true;
  const ENABLE_WARN = false;

  function getArgs(a, stringify = false) {
    const args = Array.from(a);
    if (stringify && args[0] && args[0] == '[object Object]') {
      args[0] = JSON.stringify(args[0]);
    }
    if (stringify && args[1] && args[1] == '[object Object]') {
      args[1] = JSON.stringify(args[1]);
    }
    return args;
  }

  global.LOG = function () {
    if (__DEV__) {
      const args = getArgs(arguments);
      if (ENABLE_LOGS) {
        console.log.apply(console, args);
      }
    }
  };

  global.WARN = function () {
    if (__DEV__) {
      const args = getArgs(arguments, true);
      if (ENABLE_WARN) {
        console.warn.apply(console, args);
      }
    }
  };
}
