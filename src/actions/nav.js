import { StackActions, NavigationActions } from 'react-navigation';

export function navigatePush(screen, props = {}, key) {
  return dispatch => {
    dispatch(
      NavigationActions.navigate({
        routeName: screen,
        params: props,
        key,
      }),
    );
  };
}

export function navigateBack(times, backParams) {
  return dispatch => {
    if (times && times > 1) {
      dispatch(StackActions.pop({ n: times, immediate: true }));
    } else {
      // backParams can contain { key: string, immediate: bool }
      dispatch(NavigationActions.back(backParams));
    }
  };
}

export function navigateTop() {
  return dispatch => {
    dispatch(StackActions.popToTop());
  };
}

export function navigateResetTo(screen, params = {}) {
  return dispatch => {
    dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: screen, params })],
      }),
    );
  };
}

export function navigateResetHome(params) {
  return dispatch => {
    dispatch(navigateResetTo('MainTabs', params));
  };
}

export function navigateResetLogin(params) {
  return dispatch => {
    dispatch(navigateResetTo('voke.SignUpWelcome', params));
  };
}

export function navigateResetToProfile(params) {
  return dispatch => {
    dispatch(navigateResetTo('voke.SignUpProfile', params));
  };
}

export function navigateResetMessage(params = {}) {
  return dispatch => {
    dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          // Pass in a parameter to navigate through the home page without moving around as an Anon user first
          NavigationActions.navigate({
            routeName: 'MainTabs',
            params: {
              tabName: 'voke.Conversations',
              navTo: { routeName: 'voke.Message', params },
            },
          }),
        ],
      }),
    );
  };
}
