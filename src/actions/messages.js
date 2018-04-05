import { API_URL } from '../api/utils';
import { Vibration, Platform } from 'react-native';
import { NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ, MESSAGE_CREATED } from '../constants';
import callApi, { REQUESTS } from './api';

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS, { page: 1, limit_value: 3 }));
  };
}

export function getConversationsPage(page) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS, { page, limit_value: 3 }));
  };
}

export function getConversation(data) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}me/conversations/${data}`,
    };
    return dispatch(callApi(REQUESTS.GET_CONVERSATION, query)).catch((err) => {
      LOG('getConversation error', err);
    });
  };
}

export function deleteConversation(id) {
  return (dispatch) => {
    const query = {
      id,
      endpoint: `${API_URL}me/conversations/${id}`,
    };
    return dispatch(callApi(REQUESTS.DELETE_CONVERSATION, query)).then((results) => {
      // dispatch(getConversations());
      return results;
    });
  };
}

export function createConversation(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_CONVERSATION, {}, data)).then((results) => {
      // dispatch(getConversations());
      return results;
    });
  };
}

export function getMessages(data, page) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}/messages`,
    };
    if (page && page > 1) {
      query.page = page;
    }
    return dispatch(callApi(REQUESTS.GET_MESSAGES, query));
  };
}

export function createMessage(conversation, data) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}me/conversations/${conversation}/messages`,
    };
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data)).then((results) => {
      dispatch({
        type: MESSAGE_CREATED,
        conversationId: conversation,
        message: results,
      });
      // dispatch(getMessages(conversation));
      return results;
    });
  };
}

export function handleNewMessage(message) {
  return (dispatch, getState) => {

    dispatch(vibrateAction());
    if (Platform.OS === 'ios') {
      dispatch(playSoundAction());
    }

    const conversationId = getState().messages.activeConversationId;
    const incrementBadge = conversationId && message.conversation_id !== conversationId;

    dispatch({ type: NEW_MESSAGE, message, incrementBadge });
  };
}

export function newMessageAction(message) {
  return (dispatch, getState) => {
    const cId = message.conversation_id;
    // Check if conversation exists, just use it, otherwise get it
    const conversationExists = getState().messages.conversations.find((c) => c.id === cId);
    if (conversationExists) {
      dispatch(handleNewMessage(message));
    } else {
      dispatch(getConversation(cId)).then((results) => {
        if (!results || !results.conversation) {
          return;
        }
        dispatch(handleNewMessage(message));
      }).catch((e) => {
        LOG('getConversation error inside newMessageAction', e);
      });
    }
  };
}

export function typeStateChangeAction(message) {
  return (dispatch, getState) => {
    const me = getState().auth.user.id;
    // LOG('me', me, 'you', message.message.messenger_id);
    if (me === message.message.messenger_id) {
      return;
    } else {
      const data = {
        conversationId: message.message.conversation_id,
        bool: message.notification.action === 'create',
      };
      return dispatch({ type: TYPE_STATE_CHANGE, data });
    }
  };
}

export function createTypeStateAction(conversation) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}me/conversations/${conversation}/type_state`,
    };
    return dispatch(callApi(REQUESTS.CREATE_TYPESTATE, query));
  };
}

export function destroyTypeStateAction(conversation) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}me/conversations/${conversation}/type_state`,
    };
    return dispatch(callApi(REQUESTS.DESTROY_TYPESTATE, query));
  };
}

export function createMessageInteraction(interaction) {
  return (dispatch, getState) => {
    const deviceId = getState().auth.cableId;
    if (!deviceId) return Promise.reject('NoDevice');
    const data = {
      interaction: {
        action: interaction.action,
        device_id: deviceId,
      },
    };
    const query = {
      endpoint: `${API_URL}me/conversations/${interaction.conversationId}/messages/${interaction.messageId}/interactions`,
    };
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE_INTERACTION, query, data));
  };
}

export function markReadAction(conversationId) {
  return (dispatch) => {
    dispatch({ type: MARK_READ, conversationId });
  };
}

export function vibrateAction() {
  return () => {
    // Vibrate when receiving a new message
    Vibration.vibrate(800);
  };
}

export function playSoundAction() {
  return () => {
    // Create a new sound and play it
    // const newMessageSound = new Sound('voke_ukulele_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     LOG('failed to load the sound', error);
    //     return;
    //   }
    //   newMessageSound.play((success) => {
    //     if (!success) {
    //       LOG('playback failed due to audio decoding errors');
    //       // reset the player to its uninitialized state (android only)
    //       // this is the only option to recover after an error occured and use the player again
    //       newMessageSound.reset();
    //     }
    //   });
    // });
  };
}
