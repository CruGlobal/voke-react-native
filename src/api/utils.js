import merge from 'lodash/merge';

let environment;
let baseUrl;
let authUrl;

environment = 'PROD';
baseUrl = 'https://api-stage.vokeapp.com/api/messenger/v1';
authUrl = 'https://auth-stage.vokeapp.com';

export const ENV = environment;

export const BASE_URL = baseUrl;
export const API_URL = BASE_URL + '/';
export const AUTH_URL = authUrl + '/';
export const SOCKET_URL = 'wss://api-stage.vokeapp.com/';

// setTimeout(() => console.warn('API_URL', API_URL), 1);

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function json(response) {
  return response.json ? response.json() : response;
}

function createUrl(url = '', params) {
  let newUrl = url + '';
  if (newUrl[0] === '/') {
    newUrl = newUrl.substr(1);
  }
  let fullUrl = newUrl;
  if (params && Object.keys(params).length > 0) {
    let paramsStr = Object.keys(params).map((p) => `${p}=${params[p]}`).join('&');
    if (paramsStr) {
      fullUrl += `?${paramsStr}`;
    }
  }
  return fullUrl;
}

function defaultObject(method, obj = {}, data) {
  let newObj = merge({}, { headers: DEFAULT_HEADERS }, obj, { method: method.toUpperCase() });
  if (data) {
    newObj.body = obj.stringify === false ? data : JSON.stringify(data);
  }
  return newObj;
}

export default function request(type, url, query, data, object) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, object, data);
  console.warn('REQUEST: ', newObject.method, newUrl, newObject.body); // eslint-disable-line
  return fetch(newUrl, newObject).then(json).catch((err) => {
    console.warn('fetch err', err);
    return err;
  });
}
