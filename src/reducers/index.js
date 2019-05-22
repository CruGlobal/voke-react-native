import { combineReducers } from 'redux';

import adventures from './adventures';
import analytics from './analytics';
import auth from './auth';
import channels from './channels';
import contacts from './contacts';
import journeys from './journeys';
import messages from './messages';
import nav from './nav';
import overlays from './overlays';
import videos from './videos';

export default combineReducers({
  adventures,
  analytics,
  auth,
  channels,
  contacts,
  journeys,
  messages,
  nav,
  overlays,
  videos,
});
