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
lodashForEach(apiRoutes, (routeData, key) => {
  API_CALLS[key] = (q, d) => (
    new Promise((resolve, reject) => {
      const method = routeData.method || 'get';

      // Make sure the 'method' is one of the valid types
      if (!VALID_METHODS.includes(method)) {
        reject('InvalidMethod');
        return;
      }
      // Run a check to see if the data has all the correct info
      if (routeData.beforeCall) {
        const shouldContinueMsg = routeData.beforeCall(q, d);
        if (shouldContinueMsg !== true) {
          reject(shouldContinueMsg);
          return;
        }
      }

      // Merge the extra data with the access_token
      const authHeader = q.access_token ? { Authorization: `Bearer ${q.access_token}` } : {};
      const extra = merge({}, { headers: authHeader }, routeData.extra);

      // Merge some default data from the routes with the data passed in
      const data = merge({}, routeData.data, d);
      const endpoint = q.endpoint || routeData.endpoint;

      // Call the request
      request(
        method,
        endpoint,
        // routeData.endpoint,
        q,
        method === 'get' ? undefined : data,
        extra,
      ).then(resolve).catch(reject);
    })
  );
});

export default API_CALLS;
