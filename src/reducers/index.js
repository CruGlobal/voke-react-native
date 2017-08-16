import { combineReducers } from 'redux';

import auth from './auth';
import contacts from './contacts';
import videos from './videos';

export default combineReducers({
  auth,
  contacts,
  videos,
});
