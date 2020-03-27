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

export function getMyAdventure(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result: any = await dispatch(
      request({
        ...ROUTES.GET_MY_ADVENTURE,
        pathParams: { adventureId },
      }),
    );
    return result;
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
        params: { messenger_journey_step_id: adventureStepId },
      }),
    );
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

export function createAdventureStepMessage(params: {
  value: any;
  adventure: any;
  step: any;
  kind: any;
  internalMessageId?: any;
}) {
  return async (dispatch: Dispatch, getState: any) => {
    let data: any = {
      message: {},
    };
    if (params.kind === 'question' || params.kind === 'standard') {
      data.message.content = params.value;
      data.message.messenger_journey_step_id = params.step.id;
    }
    if (
      params.kind === 'multi' ||
      params.kind === 'binary' ||
      params.kind === 'share'
    ) {
      data.message.messenger_journey_step_id =
        params.step.metadata.messenger_journey_step_id;
      data.message.messenger_journey_step_option_id = params.value;
      data.message.kind = 'answer';
    }
    if (params.internalMessageId) {
      data.message.message_reference_id = params.internalMessageId;
    }
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
      }),
    );
    dispatch({
      type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
      result: { adventureStepId: params.step.id, newMessage: result },
    });
    console.log(params.adventure);
    dispatch(getAdventureSteps(params.adventure.id));
    // if (!params.internalMessageId) {
    //   // this is the answer to the main question, so update the status to complete
    //   dispatch({
    //     type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
    //     update: {
    //       adventureStepId: params.step.id,
    //       adventureId: params.adventure.id,
    //       fieldsToUpdate: { status: 'completed' },
    //     },
    //   });
    // }
    return result;
  };
}
