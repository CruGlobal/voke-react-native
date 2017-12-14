import { combineReducers } from 'redux';

import auth from './auth';
import contacts from './contacts';
import videos from './videos';
import messages from './messages';
import channels from './channels';
import nav from './nav';

export default combineReducers({
  auth,
  contacts,
  videos,
  messages,
  channels,
  nav,
});
