import { GoogleAnalyticsTracker, GoogleTagManager, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';

let tracker = null;

export function setupAnalytics() {
  // The tracker must be constructed, and you can have multiple:
  tracker = new GoogleAnalyticsTracker('UA-12345-1');
  // let tracker2 = new GoogleAnalyticsTracker('UA-12345-2');

  // tracker1.trackScreenView('Home');
  // tracker1.trackEvent('Customer', 'New');

  // TODO: If environment is not prod, then set dry run to true
  // Setting `dryRun` to `true` lets you test tracking without sending data to GA
  // GoogleAnalyticsSettings.setDryRun(true);

  // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
  GoogleAnalyticsSettings.setDispatchInterval(30);

}

function screen(screen) {
  if (!screen || typeof screen !== 'string') {
    LOG('Screen must be passed in as a string');
    return;
  }
  tracker.trackScreenView(screen);
}

function event(category, action, label = '', value = -1) {

  // Setup the optional values as an object of {label: String, value: Number}
  let optionalValues = {};
  if (typeof label !== 'string') {
    label = '';
  }
  if (typeof value !== 'number') {
    value = -1;
  }
  if (label) {
    optionalValues.label = label;
  }
  if (value >= 0) {
    optionalValues.value = value;
  }

  if (!category || typeof category !== 'string') {
    LOG('Category must be passed in as a string');
    return;
  }
  if (!action || typeof action !== 'string') {
    LOG('Action must be passed in as a string');
    return;
  }
  tracker.trackEvent(category, action, optionalValues);
}

function setUser(id = '') {
  if (!id || typeof id !== 'string') {
    LOG('Analytics: id must be a string in setUser', id);
    return;
  }
  tracker.setUser(id);
}

export default {
  event,
  screen,
  setUser,
};
