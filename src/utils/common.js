export const isFunction = (fn) => typeof fn === 'function';
export const isArray = (arr) => Array.isArray(arr);
export const isObject = (obj) => typeof obj === 'object' && !isArray(obj);

export const exists = (v) => typeof v !== 'undefined';
export const clone = (obj) => JSON.parse(JSON.stringify(obj));
export const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });