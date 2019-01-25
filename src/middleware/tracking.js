import { DrawerActions } from 'react-navigation';

import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import {
  MAIN_TABS,
  NAVIGATE_BACK,
  NAVIGATE_FORWARD,
  NAVIGATE_POP,
  NAVIGATE_RESET,
} from '../constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import {
  STAGE_ONBOARDING_SCREEN,
  STAGE_SCREEN,
} from '../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';

export default function tracking({ dispatch, getState }) {
  return next => action => {
    let newState;
    const returnValue = next(action);
    const { nav: navState, auth: authState, tabs: tabsState } = getState();

    switch (action.type) {
      case DrawerActions.OPEN_DRAWER:
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
        console.log('check the routes in here');

        if (topRoute.routeName === MAIN_TABS) {
          newState = tabsState.activeMainTab;
          break;
        }

        if (topRoute.routeName === LANDING_SCREEN) {
          newState = tabsState.activeLoginTab;
          break;
        }

        if (topRoute.routeName === PERSON_STAGE_SCREEN) {
          newState = tabsState.activePersonStageTab;
          break;
        }

        if (
          topRoute.routeName === STAGE_SCREEN ||
          topRoute.routeName === STAGE_ONBOARDING_SCREEN
        ) {
          newState = tabsState.activeSelfStageTab;
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
