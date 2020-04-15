import RNFetchBlob from 'rn-fetch-blob';
import qs from 'qs'; // querystring parsing and stringifying
import CONSTANTS, { REDUX_ACTIONS } from '../constants';

let baseUrl;
let authUrl;

const API_VERSION = 'v1';

let domain = '';
if (!CONSTANTS.IS_STAGING) {
  setTimeout(() => console.log('🛑 POINTING TO PROD'), 1);
  domain = '';
} else {
  setTimeout(() => console.log('🟢 POINTING TO STAGING'), 1);
  domain = '-stage';
}

baseUrl = `https://api${domain}.vokeapp.com/api/messenger/${API_VERSION}`;
authUrl = `https://auth${domain}.vokeapp.com`;

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

    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(pathParams)) {
      // Match the route/{routeId}
      let param = (tempUrl.match(/\{[A-Za-z0-9]*\}/) || [])[0];
      // console.log('param, value', param, value);
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
  if (options.anonymous) {
    return params;
  }

  const token = getState().auth.authToken;

  return {
    access_token: token,
    ...params,
  };
}
// TODO: Needs refactoring.
export default function request(options) {
  return async (dispatch, getState) => {
    // console.log( "⤴️ function request INITIAL" , options );
    // console.trace();

    let finalUrl = replaceUrlParam(options.url, options.pathParams);
    const params = qs.stringify(buildParams(options, getState));
    // finalUrl = `${API_BASE_URL}${finalUrl}?${params}`;

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
      const userToken = getState().auth.authToken;
      newObj.headers['x-access-token'] = userToken;
      console.log( "TOKEN: " + userToken );
    }

    if ((options.data || {}).name === 'me[avatar]') {
      // we are uploading an image
      console.log( "we are uploading an image" );
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
      .then(resp => {
          // resp.data;
          console.log( "RNFetchBlob > resp:" ); console.log( resp );
          // return resp.data;
          dispatch({
            type: REDUX_ACTIONS.REQUEST_SUCCESS,
            url: finalUrl,
            method: newObj.method,
            result: resp,
          });

          return resp;
      })
      .catch(err => {
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

    // Log redux action.
    dispatch({
      type: REDUX_ACTIONS.REQUEST_FETCH,
      url: finalUrl,
      method: newObj.method,
      body: options.data,
    });

    console.log( "⤴️ function request FINAL" , finalUrl, newObj );

    // Do request.
    return fetch(finalUrl, newObj)
      .then(response => {
        console.log("⤵️ API response \n", response);
        if (!response.ok) {
          return response
            .json()
            .then(( message ) => {
              // Got valid JSON with error response, use it
              // throw new Error(message || response.status); << not working.
              throw message;
            })
            .catch(e => {
              // Couldn't parse the JSON
              throw e;
            });
        }
        if (options.blob) {
          return response.blob();
        }
        // Successful response, parse the JSON and return the data
        return response.json().then(r => {
          dispatch({
            type: REDUX_ACTIONS.REQUEST_SUCCESS,
            url: finalUrl,
            method: newObj.method,
            result: r,
          });
          return r;
        });
      })
      .catch(e => {
        console.log('fetch error', e);
        dispatch({
          type: REDUX_ACTIONS.REQUEST_FAIL,
          url: finalUrl,
          method: newObj.method,
          error: e,
        });
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

function imageUpload(url, headers, data) {
  console.log( "🖼 imageUpload\n", {url, headers, data} );
  RNFetchBlob.fetch(
    'PUT',
    url,
    {
      Authorization: headers.Authorization,
      'Content-Type': 'multipart/form-data',
    },
    [data],
  )
  
  .then(response => {
    console.log("⤵️ imageUpload response \n", response);
    let status = response.info().status;

    console.log( "status:" ); console.log( status );

    if(status === 200) {
    // if (!response.ok) {
      /* 
      return response
        .json();
        .then(({ message }) => {
          // Got valid JSON with error response, use it
          throw new Error(message || response.status);
        })
        .catch(e => {
          // Couldn't parse the JSON
          throw e;
        }); */

        /* return response.blob().then(({ message }) => {
          console.log( "message:" ); console.log( message );
          // Got valid JSON with error response, use it
          throw new Error(message || response.status);
        })
        .catch(e => {
          // Couldn't parse the JSON
          throw e;
        });; */
    }
     /* return response.blob(); */
    /* if (options.blob) {
      return response.blob();
    } */
     return response.blob();
    // let json = response.json();
    // return json;
    // Successful response, parse the JSON and return the data
   /*  dispatch({
        type: REDUX_ACTIONS.REQUEST_SUCCESS,
        url: url,
        method: 'PUT',
        result: json,
    }); */

   
  })
  .catch(e => {
    console.log('fetch error', e);
   /*  dispatch({
      type: REDUX_ACTIONS.REQUEST_FAIL,
      url: url,
      method: 'PUT',
      error: e,
    }); */
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

  
  
  
  /* 
  .then((res) => {
    let status = res.info().status;

    console.log( "status:" ); console.log( status );

    if(status == 200) {
      // the conversion is done in native code
      let base64Str = res.base64()
      // the following conversions are done in js, it's SYNC
      let text = res.text()
      let json = res.json()
      console.log( "json:" ); console.log( json );
      return json;
    } else {
      // handle other status codes
      console.log( 'wrong status!' )
    }
  })
  // Something went wrong:
  .catch((errorMessage, statusCode) => {
    // error handling
    console.log( "errorMessage:" ); console.log( errorMessage );
    console.log( "statusCode:" ); console.log( statusCode );
  }) */

}

export function json(response) {
  return response.json ? response.json() : response;
}
