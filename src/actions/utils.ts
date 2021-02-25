import RNFetchBlob from 'rn-fetch-blob';
import qs from 'qs'; // querystring parsing and stringifying
import CONSTANTS from 'utils/constants';

import configureStore from '../store';
configureStore({});

const API_VERSION = 'v1';

let domain = '';
if (!CONSTANTS.IS_STAGING) {
  domain = '';
} else {
  domain = '-stage';
}

const baseUrl = `https://api${domain}.vokeapp.com/api/messenger/${API_VERSION}`;
const authUrl = `https://auth${domain}.vokeapp.com`;

export const BASE_URL = baseUrl;
export const API_BASE_URL = BASE_URL + '/';
export const AUTH_URL = authUrl + '/';
export const SOCKET_URL = `wss://api${domain}.vokeapp.com/`;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function replaceUrlParam(url, pathParams) {
  if (url.includes('{') && url.includes('}') && pathParams) {
    let tempUrl = url;

    for (const [, value] of Object.entries(pathParams)) {
      // Match the route/{routeId}
      let param = (tempUrl.match(/\{[A-Za-z0-9]*\}/) || [])[0];

      // Remove the brackets from the matching result
      if (param) {
        param = param.replace(/[{}]/g, '');
        if (typeof value !== 'undefined') {
          tempUrl = tempUrl.replace(`{${param}}`, value);
        }
      }
      console.log('tempUrl', tempUrl);
    }

    return tempUrl;
  }
  return url;
}

function buildParams(options) {
  const params = options.params || {};
  // Add on the version as a query parameter
  if (options.anonymous) {
    return params;
  }

  const token = options.authToken;

  return {
    access_token: token,
    ...params,
  };
}
// TODO: Needs refactoring.
export default function request<T>(options): Promise<T> {
  let finalUrl = replaceUrlParam(options.url, options.pathParams);
  const params = qs.stringify(buildParams(options));

  if (options.isAuth) {
    finalUrl = `${AUTH_URL}${finalUrl}?${params}`;
  } else {
    finalUrl = `${API_BASE_URL}${finalUrl}?${params}`;
  }

  const newObj = {
    headers: options.headers
      ? { ...DEFAULT_HEADERS, ...options.headers }
      : DEFAULT_HEADERS,
    method: (options.method || 'GET').toUpperCase(),
    url: finalUrl,
  };

  if (!options.anonymous) {
    const userToken = options.authToken;
    newObj.headers['x-access-token'] = userToken;
  }

  if ((options.data || {}).name === 'me[avatar]') {
    // we are uploading an image
    return RNFetchBlob.fetch(
      'PUT',
      finalUrl,
      {
        Authorization: newObj.headers.Authorization,
        'Content-Type': 'multipart/form-data',
      },
      [options.data],
    )
      .then(json)
      .then((resp) => {
        console.log('RNFetchBlob > resp:');
        console.log(resp);

        return resp;
      })
      .catch((err) => {
        console.log('fetch blob err', err);
        return err;
      });
  }

  if (options.method !== 'get') {
    newObj.body =
      options.stringify === false
        ? { ...options.data, ...(options.customData || {}) }
        : JSON.stringify({ ...options.data, ...(options.customData || {}) });
  }

  // Do request.
  return fetch(finalUrl, newObj)
    .then((response) => {
      if (!response.ok) {
        return response
          .json()
          .then((message) => {
            // Got valid JSON with error response, use it
            throw message;
          })
          .catch((e) => {
            // Couldn't parse the JSON
            throw { ...e, ...{ status: response.status } };
          });
      }
      if (options.blob) {
        return response.blob();
      }
      // Successful response, parse the JSON and return the data
      return response.json().then((r) => {
        return r as Promise<T>;
      });
    })
    .catch((e) => {
      console.log('fetch error', e);

      // If user blocked server will return 403,
      // meaning we should to mark the current user as blocked in the store.
      if (e.status === 403) {
      }

      return e;
    });
}

export function json(response) {
  return response.json ? response.json() : response;
}
