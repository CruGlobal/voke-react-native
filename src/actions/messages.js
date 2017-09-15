import { API_URL } from '../api/utils';
import { Vibration } from 'react-native';
import { NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ } from '../constants';
import callApi, { REQUESTS } from './api';
import Sound from 'react-native-sound';

let newMessageSound = new Sound('voke_ukulele_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    LOG('failed to load the sound', error);
    return;
  }
  // loaded successfully
  LOG('duration in seconds: ' + newMessageSound.getDuration() + 'number of channels: ' + newMessageSound.getNumberOfChannels());
});

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS)).then((results) => {
      // LOG('results', results.conversations[0]);
      return results;
    });
  };
}

export function getConversation(data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}`,
    };
    return dispatch(callApi(REQUESTS.GET_CONVERSATION, query));
  };
}

export function deleteConversation(data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}`,
    };
    return dispatch(callApi(REQUESTS.DELETE_CONVERSATION, query)).then((results) => {
      dispatch(getConversations());
      return results;
    });
  };
}

export function createConversation(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_CONVERSATION, {}, data)).then((results) => {
      dispatch(getConversations());
      return results;
    });
  };
}

export function getMessages(data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}/messages`,
    };
    return dispatch(callApi(REQUESTS.GET_MESSAGES, query));
  };
}

export function createMessage(conversation, data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${conversation}/messages`,
    };
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data)).then((results) => {
      dispatch(getMessages(conversation));
      return results;
    });
  };
}

export function newMessageAction(message) {
  return (dispatch) => {
    return dispatch(getConversation(message.conversation_id)).then(()=>{
      dispatch({ type: NEW_MESSAGE, message });
      Vibration.vibrate(1500);
      newMessageSound.play((success) => {
        if (success) {
          LOG('successfully finished playing');
        } else {
          LOG('playback failed due to audio decoding errors');
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          newMessageSound.reset();
        }
      });
    });
  };
}

export function typeStateChangeAction(message) {
  return (dispatch, getState) => {
    let me = getState().auth.user.id;
    // LOG('me', me, 'you', message.message.messenger_id);
    if (me === message.message.messenger_id) {
      return;
    } else {
      let data = {
        conversationId: message.message.conversation_id,
        bool: message.notification.action === 'create' ? true : false,
      };
      return dispatch({ type: TYPE_STATE_CHANGE, data });
    }
  };
}

export function createTypeStateAction(conversation) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${conversation}/type_state`,
    };
    return dispatch(callApi(REQUESTS.CREATE_TYPESTATE, query)).then((results)=>{
      // LOG('im herheher isissjijsi',results);
    });
  };
}

export function destroyTypeStateAction(conversation) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${conversation}/type_state`,
    };
    return dispatch(callApi(REQUESTS.DESTROY_TYPESTATE, query));
  };
}

export function createMessageInteraction(interaction) {
  return (dispatch, getState) => {
    let data = {
      interaction: {
        action: interaction.action,
        device_id: getState().auth.cableId,
      },
    };
    let query = {
      endpoint: `${API_URL}me/conversations/${interaction.conversationId}/messages/${interaction.messageId}/interactions`,
    };
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE_INTERACTION, query, data)).then(()=>{
      // dispatch(getConversations());
      // LOG('creating message interaction');
      dispatch({ type: MARK_READ, conversationId: interaction.conversationId });
    });
  };
}
