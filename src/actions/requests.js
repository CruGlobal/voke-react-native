// import { REDUX_ACTIONS, TABLES, COMMON_ROLES, REF_LIST_CODES } from '../constants';
import request, { uploadToS3 } from './utils';
import ROUTES from './routes';
// import { objToArr, asyncForEach, isArray, getOfflineData } from '../utils';
// import { refreshProjectPage, saveCommentOffline } from './sync';
// import { dummyPreviewProjectId } from '../utils/schema';

export function getAllData(queryTables, params = {}, options = {}) {
  return async (dispatch, getState) => {
    const data = await dispatch(
      request({
        ...ROUTES.GET_ALL_DATA,
        // params: { ...(params || {}), tables },
      }),
    );
  };
}
