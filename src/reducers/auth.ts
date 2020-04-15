/* eslint-disable @typescript-eslint/camelcase */
import { REDUX_ACTIONS } from '../constants';
import { exists } from '../utils';

export type AuthDataKeys = 'deviceInformation' | 'adventureInvitations';
interface InitialStateTypes {
  isLoggedIn: boolean,
  authToken?: string,
  pushToken?: string,
  pushDeviceId?: string,
  deviceInformation: object, // TODO: IDeviceInformation interface here
  user: {
    firstName?: string,
    lastName?: string,
  },
  modalProps: object, // TODO: IModalProps interface here
}

const initialState: InitialStateTypes = {
  isLoggedIn: false,
  authToken: '',
  pushToken: '',
  pushDeviceId: '',
  language: '',
  deviceInformation: {},
  user: {
    firstName: '',
    lastName: '',
  },
  modalProps: {},
};

export default function (
  state = initialState,
  action: {
    type: any;
    key: string | number;
    data: any;
    modalProps: any;
    user: any;
    pushToken: any;
    deviceId: any;
    authToken: any;
  },
) {
  console.log( "action:" ); console.log( action );
  switch (action.type) {
    case REDUX_ACTIONS.SET_AUTH_DATA:
      // @ts-ignore
      if (!exists(state[action.key]) || !action.data) {
        return state;
      }
      return { ...state, [action.key]: action.data };
    case REDUX_ACTIONS.SHOW_MODAL:
      return { ...state, modalProps: action.modalProps || {} };
    case REDUX_ACTIONS.HIDE_MODAL:
      return { ...state, modalProps: {} };
    case REDUX_ACTIONS.LOGIN:
      return { ...state, authToken: action.authToken };
    case REDUX_ACTIONS.SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        authToken: action.user.access_token.access_token,
        language: action.user.language.language_code,
        user:{
          id: action.user.id,
          email: action.user.email,
          firstName: action.user.first_name,
          lastName: action.user.last_name,
          avatar: action.user.avatar,
          vokebotConversationId: action.user.vokebot_conversation_id,
          // beliefScale: action.user.belief_scale,

         /*  pendingNotifications: action.user.pending_notifications,
          pendingConversations: action.user.pending_conversations,
          pendingAdventures: action.user.pending_adventures, */

          // Not used
          // mainAdventureId: action.user.main_adventure_id,
          // state: action.user.state, - don't use it.
          // initials: action.user.initials, - don't use it.
          // presentAt: action.user.present_at,
        }
      };
    case REDUX_ACTIONS.SET_PUSH_TOKEN:
      return { ...state, pushToken: action.pushToken };
    case REDUX_ACTIONS.SET_PUSH_DEVICE_ID:
      return { ...state, pushDeviceId: action.deviceId };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
