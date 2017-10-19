import { API_URL } from '../api/utils';
import { Vibration, Platform } from 'react-native';
import { NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ, UNREAD_CONV_DOT, MESSAGE_CREATED } from '../constants';
import callApi, { REQUESTS } from './api';
// TODO: Remove this package from react-native
// import Sound from 'react-native-sound';

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS));
  };
}

export function getConversationsPage(page) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS, { page }));
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

export function newMessageAction(message) {
  return (dispatch, getState) => {
    if (getState().messages.inShare) {
      return;
    }
    return dispatch(getConversation(message.conversation_id)).then(() => {
      dispatch({ type: NEW_MESSAGE, message });

      dispatch(vibrateAction());
      dispatch(playSoundAction());


      const activeScreen = getState().auth.activeScreen;
      const conversationId = getState().messages.activeConversationId;
      if (activeScreen === 'voke.Message' && message.conversation_id !== conversationId) {
        dispatch({ type: UNREAD_CONV_DOT, show: true });
      }
    });
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
    if (Platform.OS === 'ios') {
      Vibration.vibrate(1500);
    }
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
