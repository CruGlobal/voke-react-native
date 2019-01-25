// import * as RNOmniture from 'react-native-omniture';
// eslint-disable-next-line no-unused-vars
import { Tracker, Emitter } from '@ringierag/snowplow-reactjs-native-tracker';
import Config from 'react-native-config';

import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  ID_SCHEMA,
} from '../constants';
import { isCustomStep } from '../utils/common';

/* testing only */
// export const emitterCallback = (error, response) => {
//   if (error) {
//     return Promise.reject({
//       snowplowError: error,
//     });
//   } else if (response && response.status !== 200) {
//     return Promise.reject({
//       snowplowError: response,
//     });
//   }
// };

/*const em = new Emitter(
  Config.SNOWPLOW_URL,
  'https',
  443,
  'POST',
  1,
  emitterCallback,
);*/

export function updateAnalyticsContext(analyticsContext) {
  return {
    type: ANALYTICS_CONTEXT_CHANGED,
    analyticsContext: analyticsContext,
  };
}

export function trackActionWithoutData(action) {
  return trackAction(action.name, { [action.key]: null });
}

export function trackAction(action, data) {
  const newData = Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [key]: data[key] ? data[key] : '1' }),
    {},
  );

  // return () => RNOmniture.trackAction(action, newData);
}

export function trackState(trackingObj) {
  return (dispatch, getState) => {
    if (!trackingObj) {
      return;
    }
    const { analytics, auth } = getState();

    const updatedContext = addTrackingObjToContext(
      trackingObj,
      analytics,
      auth,
    );

    dispatch(updateAnalyticsContext(updatedContext));
    return dispatch(trackStateWithMCID(updatedContext));
  };
}

function trackStateWithMCID(context) {
  return dispatch => {
    if (context[ANALYTICS.MCID]) {
      sendState(context);
    } else {
      // RNOmniture.loadMarketingCloudId(result => {
      //   const updatedContext = { ...context, [ANALYTICS.MCID]: result };
      //   sendState(updatedContext);
      //   dispatch(updateAnalyticsContext(updatedContext));
      // });
    }
  };
}

function sendState(context) {
  // RNOmniture.trackState(context[ANALYTICS.SCREENNAME], context);
}

// eslint-disable-next-line no-unused-vars
function sendStateToSnowplow(context) {
  const idData = {
    gr_master_person_id: context[ANALYTICS.GR_MASTER_PERSON_ID],
    sso_guid: context[ANALYTICS.SSO_GUID],
    mcid: context[ANALYTICS.MCID],
  };

  const tracker = new Tracker(
    [
      /*em*/
    ],
    null,
    Config.SNOWPLOW_APP_ID,
    true,
  );
  tracker.core.addPayloadPair('url', context[ANALYTICS.SCREENNAME]);

  tracker.trackScreenView(context[ANALYTICS.SCREENNAME], null, [
    {
      schema: ID_SCHEMA,
      data: idData,
    },
  ]);
}

function addTrackingObjToContext(trackingObj, analytics, auth) {
  const newTrackingObj = { ...trackingObj, name: `mh : ${trackingObj.name}` };

  return {
    ...analytics,
    [ANALYTICS.SCREENNAME]: newTrackingObj.name,
    [ANALYTICS.SITE_SECTION]: newTrackingObj.section,
    [ANALYTICS.SITE_SUBSECTION]: newTrackingObj.subsection,
    [ANALYTICS.SITE_SUB_SECTION_3]: newTrackingObj.level3,
    [ANALYTICS.SITE_SUB_SECTION_4]: newTrackingObj.level4,
    [ANALYTICS.GR_MASTER_PERSON_ID]: auth.person.global_registry_mdm_id,
  };
}

export function logInAnalytics() {
  return (dispatch, getState) => {
    const context = getState().analytics;
    const updatedContext = {
      ...context,
      [ANALYTICS.LOGGED_IN_STATUS]: ANALYTICS.LOGGED_IN,
    };

    return dispatch(updateAnalyticsContext(updatedContext));
  };
}
