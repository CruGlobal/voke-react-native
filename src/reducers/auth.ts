/* eslint-disable @typescript-eslint/camelcase */
import { REDUX_ACTIONS } from 'utils/constants';
import { TUser } from 'utils/types';
import { exists } from 'utils';

export type AuthDataKeys = 'device' | 'authType' | 'adventureInvitations';
interface InitialStateTypes {
  isLoggedIn: boolean;
  authType: 'email' | 'apple' | 'facebook' | undefined;
  authToken?: string;
  pushToken?: string; // Push Notifications token receved from apple/google.
  deviceId?: string; // Device ID returend by server after provided with Push Notfications Tocken.
  language?: string;
  device: object; // TODO: IDeviceInformation interface here
  user: TUser;
  modalProps: object; // TODO: IModalProps interface here
  userBlocked: {
    isBlocked: boolean;
  };
  ws?: object;
}

const initialState: InitialStateTypes = {
  isLoggedIn: false,
  authType: undefined,
  authToken: '',
  pushToken: '',
  pushDeviceId: '',
  language: '',
  device: {
    id: '',
  },
  user: {
    id: '',
    firstName: '',
    lastName: '',
  },
  modalProps: {},
  userBlocked: {
    isBlocked: false,
  },
  ws: undefined,
};

export default function (
  state = initialState,
  action: {
    type: any;
    key: string | number;
    data: any;
    modalProps: any;
    user: any;
    device: any;
    authToken: any;
    pushToken: any;
    deviceId: any;
  },
) {
  // console.log( "Redux action: " + action.type, action );
  switch (action.type) {
    case REDUX_ACTIONS.SET_AUTH_DATA:
      // @ts-ignore
      if (!action.key || !action.data) {
        return state;
      }
      return { ...state, [action.key]: action.data };
    case REDUX_ACTIONS.SHOW_MODAL:
      return { ...state, modalProps: action.modalProps || {} };
    case REDUX_ACTIONS.HIDE_MODAL:
      return { ...state, modalProps: {} };
    case REDUX_ACTIONS.STARTUP:
      return state;
    case REDUX_ACTIONS.LOGIN:
      return { ...state, authToken: action.authToken };
    case REDUX_ACTIONS.SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        authToken: action.user.access_token.access_token,
        language: action.user.language.language_code,
        user: {
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
        },
      };
    case REDUX_ACTIONS.SET_DEVICE:
      return {
        ...state,
        device: {
          // See available fields at:
          // https://docs.vokeapp.com/#me-devices-create-device
          id: action.device.id,
          version: action.device.version,
          local_version: action.device.local_version,
          local_id: action.device.local_id,
          family: action.device.family,
          name: action.device.name,
          os: action.device.os,
          /*
          Not stored data:
          queue_name(pin):null
          queue_url(pin):null
          backup_queue_name(pin):null
          backup_queue_url(pin):null
          created_at(pin):"2020-04-18T16:39:37.620Z"
          updated_at(pin):"2020-04-19T03:29:31.587Z" */
        },
      };
    case REDUX_ACTIONS.SET_PUSH_TOKEN:
      return { ...state, pushToken: action.pushToken };
    case REDUX_ACTIONS.SET_PUSH_DEVICE_ID: // TODO: delete.
      return { ...state, pushDeviceId: action.deviceId };
    case REDUX_ACTIONS.OPEN_SOCKETS:
      return state;
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    case REDUX_ACTIONS.BLOCK:
      return {
        ...state,
        userBlocked: {
          isBlocked: true,
        },
      };
    default:
      return state;
  }
}
