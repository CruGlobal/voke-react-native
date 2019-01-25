import { trackState } from '../actions/analytics';
import { trackableScreens, tabs } from '../AppRoutes';
import {
  NAVIGATE_BACK,
  NAVIGATE_FORWARD,
  NAVIGATE_POP,
  NAVIGATE_RESET,
} from '../constants';
// import { LANDING_SCREEN } from '../containers/LandingScreen';
// import {
//   STAGE_ONBOARDING_SCREEN,
//   STAGE_SCREEN,
// } from '../containers/StageScreen';
// import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';

export default function tracking({ dispatch, getState }) {
  return next => action => {
    let newState;
    const returnValue = next(action);
    const { nav: navState, auth: authState } = getState();

    switch (action.type) {
      case NAVIGATE_FORWARD:
        newState = getNextTrackState(action, authState, dispatch);

        // if (
        //   action.routeName === STEPS_TAB ||
        //   action.routeName === PEOPLE_TAB ||
        //   action.routeName === GROUPS_TAB
        // ) {
        //   dispatch({ type: MAIN_TAB_CHANGED, newActiveTab: newState });
        // }
        break;

      case NAVIGATE_BACK:
      case NAVIGATE_POP:
        const routes = navState.routes;
        const topRoute = routes[routes.length - 1];

        if (topRoute.routeName === 'MainTabs') {
          const active = topRoute.routes[topRoute.index].key;
          if (active && tabs[active]) {
            newState = tabs[active].tracking;
          }
          break;
        }

        newState = getNextTrackState(topRoute, authState, () => {});
        break;

      case NAVIGATE_RESET:
        newState = trackRoute(action.actions[0]);
        break;
    }

    newState && dispatch(trackState(newState));
    return returnValue;
  };
}

function getNextTrackState(action) {
  const routeName = action.routeName;
  const trackedRoute = trackableScreens[routeName];

  if (trackedRoute) {
    return trackedRoute.tracking;
  } else if (action.params && action.params.trackingObj) {
    //todo test trackingObj is ignored if screen is in trackableScreens
    return action.params.trackingObj;
  }
}

function trackRoute(route) {
  const trackedRoute = trackableScreens[route.routeName];
  if (trackedRoute) {
    return trackedRoute.tracking;
  }
}
