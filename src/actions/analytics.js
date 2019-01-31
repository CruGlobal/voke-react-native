import * as RNOmniture from 'react-native-omniture';

import {
  ACTIONS,
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  ID_SCHEMA,
} from '../constants';

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

  console.log('tracking action', action, newData);
  return () => RNOmniture.trackAction(action, newData);
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
      RNOmniture.loadMarketingCloudId(result => {
        const updatedContext = { ...context, [ANALYTICS.MCID]: result };
        sendState(updatedContext);
        dispatch(updateAnalyticsContext(updatedContext));
      });
    }
  };
}

function sendState(context) {
  console.log('tracking state', context[ANALYTICS.SCREENNAME], context);
  RNOmniture.trackState(context[ANALYTICS.SCREENNAME], context);
}

function addTrackingObjToContext(trackingObj, analytics, auth) {
  const newTrackingObj = { ...trackingObj, name: `voke : ${trackingObj.name}` };

  return {
    ...analytics,
    [ANALYTICS.SCREENNAME]: newTrackingObj.name,
    [ANALYTICS.SITE_SECTION]: newTrackingObj.section,
    [ANALYTICS.SITE_SUBSECTION]: newTrackingObj.subsection,
    [ANALYTICS.SITE_SUB_SECTION_3]: newTrackingObj.level3,
    [ANALYTICS.SITE_SUB_SECTION_4]: newTrackingObj.level4,
    // TODO: We need this on the user object
    // [ANALYTICS.GR_MASTER_PERSON_ID]: auth.user.global_registry_mdm_id,
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
