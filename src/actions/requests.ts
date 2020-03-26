import request from './utils';
import ROUTES from './routes';
import { REDUX_ACTIONS } from '../constants';
import { ThunkDispatch } from 'redux-thunk';
import { DataKeys } from '../reducers/data';

type Dispatch = ThunkDispatch<any, any, any>;

export function setData(key: DataKeys, data: any) {
  return {
    type: REDUX_ACTIONS.SET_DATA,
    key,
    data,
  };
}

export function getAvailableAdventures() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_AVAILABLE_ADVENTURES }),
    );
    const adventures = results.organization_journeys;
    dispatch(setData('availableAdventures', adventures));
    return results;
  };
}

export function getMyAdventures() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_MY_ADVENTURES }),
    );
    const myAdventures = results.journeys;
    dispatch(setData('myAdventures', myAdventures));
    return results;
  };
}

export function getAdventuresInvitations() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_ADVENTURE_INVITATIONS }),
    );
    const adventureInvitations = results.journey_invites;
    dispatch(setData('adventureInvitations', adventureInvitations));
    return results;
  };
}

export function getAdventureSteps(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.GET_ADVENTURE_STEPS,
        pathParams: { adventureId },
      }),
    );
    console.warn(results);
    const adventureSteps = results.steps;
    dispatch({
      type: REDUX_ACTIONS.GET_ADVENTURE_STEPS,
      result: { adventureId, adventureSteps },
    });
    return results;
  };
}

export function getAdventureStepMessages(
  adventureConversationId: any,
  adventureStepId: any,
) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.GET_ADVENTURE_STEP_MESSAGES,
        pathParams: { adventureConversationId },
        messenger_journey_step_id: adventureStepId,
      }),
    );
    console.warn(results);
    const adventureStepMessages = results.messages;
    dispatch({
      type: REDUX_ACTIONS.GET_ADVENTURE_STEP_MESSAGES,
      result: { adventureStepId, adventureStepMessages },
    });
    return results;
  };
}

export function startAdventure(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await dispatch(request({ ...ROUTES.START_ADVENTURE, data }));
    dispatch({
      type: REDUX_ACTIONS.START_ADVENTURE,
      result,
    });
    return result;
  };
}

export function sendAdventureInvitation(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await dispatch(
      request({ ...ROUTES.SEND_ADVENTURE_INVITATION, data }),
    );
    dispatch({
      type: REDUX_ACTIONS.SEND_ADVENTURE_INVITATION,
      result,
    });
    return result;
  };
}

export function putUsersAccountId(userId: any, data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await dispatch(
      request({ ...ROUTES.USERS_ACCOUNT_ID_PUT, pathParams: { userId }, data }),
    );
    return results;
  };
}
