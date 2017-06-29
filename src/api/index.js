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

// Setup API call
let API_CALLS = {};
lodashForEach(apiRoutes, (data, key) => {
  API_CALLS[key] = (q, d) => (
    new Promise((resolve, reject) => {
      const req = data;
      const method = req.type || 'get';
      if (req.beforeCall) {
        const shouldContinueMsg = req.beforeCall(q, d);
        if (shouldContinueMsg !== true) {
          reject(shouldContinueMsg);
          return;
        }
      }
      request(
        req.type || 'get',
        req.endpoint,
        q,
        method === 'get' ? undefined : d,
        req.extra || undefined,
      ).then(resolve).catch(reject);
    })
  );
});

export default API_CALLS;
