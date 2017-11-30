import { combineReducers } from 'redux';

import auth from './auth';
import contacts from './contacts';
import videos from './videos';
import messages from './messages';
import channels from './channels';

export default combineReducers({
  auth,
  contacts,
  videos,
  messages,
  channels,
});
