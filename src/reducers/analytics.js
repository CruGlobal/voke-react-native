import i18n from 'i18next';

import { ANALYTICS_CONTEXT_CHANGED, ANALYTICS, LOGOUT } from '../constants';

const initialAnalyticsState = {
  [ANALYTICS.MCID]: '',
  [ANALYTICS.SCREENNAME]: '',
  [ANALYTICS.SITE_SECTION]: '',
  [ANALYTICS.SITE_SUBSECTION]: '',
  [ANALYTICS.SITE_SUB_SECTION_3]: '',
  [ANALYTICS.CONTENT_AUDIENCE_TARGET]: '',
  [ANALYTICS.CONTENT_TOPIC]: '',
  [ANALYTICS.LOGGED_IN_STATUS]: ANALYTICS.NOT_LOGGED_IN,
  [ANALYTICS.SSO_GUID]: '',
  ['cru.appname']: 'Voke App',
  [ANALYTICS.GR_MASTER_PERSON_ID]: '',
  [ANALYTICS.FACEBOOK_ID]: '',
  [ANALYTICS.CONTENT_LANGUAGE]: i18n.language,
};

function analyticsReducer(state = initialAnalyticsState, action) {
  switch (action.type) {
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...action.analyticsContext,
      };
    case LOGOUT:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: '',
        [ANALYTICS.GR_MASTER_PERSON_ID]: '',
        [ANALYTICS.FACEBOOK_ID]: '',
        [ANALYTICS.LOGGED_IN_STATUS]: ANALYTICS.NOT_LOGGED_IN,
      };
    default:
      return state;
  }
}

export default analyticsReducer;
