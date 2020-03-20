import { combineReducers } from 'redux';

import analytics from './analytics';
import auth from './auth';
import channels from './channels';
import journeys from './journeys';
import messages from './messages';
import nav from './nav';
import overlays from './overlays';
import videos from './videos';

export default combineReducers({
  analytics,
  auth,
  channels,
  journeys,
  messages,
  nav,
  overlays,
  videos,
});
