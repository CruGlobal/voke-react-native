import { combineReducers } from 'redux';

import auth from './auth';
import contacts from './contacts';
import navigation from './navigation';

export default combineReducers({
  navigation,
  auth,
  contacts,
});