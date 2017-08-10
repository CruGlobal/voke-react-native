import merge from 'lodash/merge';
import lodashForEach from 'lodash/forEach';
import request from './utils';
import apiRoutes from './routes';

// const DEFAULT_ERROR = 'Error, something went wrong';

// function error(cb) {
//   return (err) => { cb({}, err || DEFAULT_ERROR); };
// }

// function handleNoData(cb) {
//   return (data) => {
//     if (data) {
//       if (data && data.error) {
//         cb({}, data.error);
//       } else {
//         cb({});
//       }
//     }
//   };
// }

// function handleData(cb) {
//   return (data) => {
//     if (data && data.error) {
//       cb({}, data.error);
//     } else {
//       cb(data);
//     }
//   };
// }

const VALID_METHODS = ['get', 'put', 'post', 'delete'];

// Setup API call
let API_CALLS = {};
lodashForEach(apiRoutes, (data, key) => {
  API_CALLS[key] = (q, d) => (
    new Promise((resolve, reject) => {
      const req = data;
      const method = req.method || 'get';
      if (!VALID_METHODS.includes(method)) {
        reject('InvalidMethod');
        return;
      }
      if (req.beforeCall) {
        const shouldContinueMsg = req.beforeCall(q, d);
        if (shouldContinueMsg !== true) {
          reject(shouldContinueMsg);
          return;
        }
      }
      const authHeader = q.access_token ? { Authorization: `Bearer ${q.access_token}` } : {};
      const extra = merge({}, req.extra, { headers: authHeader });
      request(
        method,
        req.endpoint,
        q,
        method === 'get' ? undefined : d,
        extra,
      ).then(resolve).catch(reject);
    })
  );
});

export default API_CALLS;
