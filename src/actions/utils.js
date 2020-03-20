import auth from '@react-native-firebase/auth';
import qs from 'qs';
import { REDUX_ACTIONS } from '../constants';

let baseUrl = 'https://a.tribl.com/';

export const ImageBaseHref = 'https://diq8orop83eh2.cloudfront.net/';
// export const ImageBaseHref = 'https://aimg.tribl.com/';
export const APIBaseHref = 'https://a.tribl.com/';
// export const APIBaseHref = 'http://localhost:3003/';
// export const APIBaseHref = 'http://192.168.0.173:3003/';

export const API_BASE_URL = baseUrl;
export const IMAGE_BASE_URL = 'https://diq8orop83eh2.cloudfront.net/';
export const IS_LOCAL = baseUrl.startsWith('http://localhost') || baseUrl.startsWith('http://192.168');
export const IS_DEV = baseUrl.startsWith('https://api-dev.hummingbirdtool.com');

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function replaceUrlParam(url, pathParams) {
  if (url.includes('{') && url.includes('}') && pathParams) {
    let tempUrl = url;

    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(pathParams)) {
      // Match the route/{routeId}
      let param = (tempUrl.match(/\{[A-Za-z0-9]*\}/) || [])[0];
      console.log('param, value', param, value);
      // Remove the brackets from the matching result
      if (param) {
        // eslint-disable-next-line no-useless-escape
        param = param.replace(/[\{\}]/g, '');
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

function buildParams(options, getState) {
  const params = options.params || {};
  // Add on the version as a query parameter
  params.version = 'v2';
  if (options.anonymous) {
    return params;
  }

  const token = getState().auth.token;

  return {
    access_token: token,
    ...params,
  };
}

export default function request(options) {
  return async (dispatch, getState) => {
    let finalUrl = replaceUrlParam(options.url, options.pathParams);
    const params = qs.stringify(buildParams(options, getState));
    finalUrl = `${API_BASE_URL}${finalUrl}?${params}`;
    const newObj = {
      headers: options.headers ? { ...DEFAULT_HEADERS, ...options.headers } : DEFAULT_HEADERS,
      method: (options.method || 'GET').toUpperCase(),
      url: finalUrl,
    };
    if (!options.anonymous) {
      const userToken = await auth().currentUser.getIdToken();
      newObj.headers['x-access-token'] = userToken;
    }
    if (options.method !== 'get') {
      newObj.body = options.stringify === false ? options.data : JSON.stringify(options.data);
    }

    dispatch({ type: REDUX_ACTIONS.REQUEST_FETCH, url: finalUrl, method: newObj.method, body: options.data });
    return fetch(finalUrl, newObj)
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then(({ message }) => {
              // Got valid JSON with error response, use it
              throw new Error(message || response.status);
            })
            .catch((e) => {
              // Couldn't parse the JSON
              throw e;
            });
        }
        if (options.blob) {
          return response.blob();
        }
        // Successful response, parse the JSON and return the data
        return response.json().then((r) => {
          dispatch({ type: REDUX_ACTIONS.REQUEST_SUCCESS, url: finalUrl, method: newObj.method, result: r });
          return r;
        });
      })
      .catch((e) => {
        console.log('fetch error', e);
        dispatch({ type: REDUX_ACTIONS.REQUEST_FAIL, url: finalUrl, method: newObj.method, error: e });
        // if (options.url !== ROUTES.LOGOUT.url) {
        //   const unauthMessages = [
        //     'Missing active access token',
        //     'Unable to validate token',
        //     'Sorry, that token is no longer valid',
        //     'Valid token is missing user',
        //   ];
        //   if (e && unauthMessages.includes(e.message)) {
        //     console.log('unable to validate token. User needs to login again.');
        //     if ([ROUTES.LOGIN.url, ROUTES.LOGIN_WITH_TOKEN.url].includes(options.url)) {
        //       // Trying to login, but got an error message, just show the toast
        //       toast.error({ message: e.message });
        //     } else {
        //       dispatch(showModal({ type: 'UserUnauth' }));
        //     }
        //   }
        // }

        // Couldn't parse the JSON
        throw e;
      });
  };
}

export async function uploadToS3({ url, fields, file }) {
  const form = new FormData();
  // Append all the fields from the server into the FormData
  for (const field in fields) {
    form.append(field, fields[field]);
  }

  // Always append the file last
  form.append('file', file);

  const options = {
    method: 'POST',
    body: form,
  };
  await fetch(url, options);
}
