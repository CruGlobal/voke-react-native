import merge from 'lodash/merge';

let environment;
let baseUrl;

environment = 'PROD';
baseUrl = 'http://swapi.co';

export const ENV = environment;

export const BASE_URL = baseUrl;
export const API_URL = BASE_URL + '/api/';

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
  let fullUrl = API_URL + newUrl;
  if (params && Object.keys(params).length > 0) {
    let paramsStr = Object.keys(params).map((p) => `${p}=${params[p]}`).join('&');
    if (paramsStr) {
      fullUrl += `?${paramsStr}`;
    }
  }
  return fullUrl;
}

function defaultObject(method, obj = {}, data) {
  // TODO: Clone Deep, use lodash
  let newObj = merge({}, { headers: DEFAULT_HEADERS }, obj, { method: method.toUpperCase() });
  if (data) {
    newObj.body = obj.stringify === false ? data : JSON.stringify(data);
  }
  return newObj;
}

export default function request(type, url, query, data, object) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, object, data);
  // console.warn('REQUEST: ', newObject.method, newUrl, newObject.body); // eslint-disable-line
  return fetch(newUrl, newObject).then(json);
}
