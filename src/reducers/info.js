import { REDUX_ACTIONS } from '../constants';

const initialState = {
  pushNotificationPermission: '',
  notificationsRequest: false,
  toastProps: {},
  currentScreen: {
    screen: '',
    data: {},
  },
};

export default function(
  state = initialState,
  action: {
    props: any;
    toastProps: any;
    permission: any;
    notificationsRequest: any;
    screen: any;
    data: any;
  },
  ) {
  switch (action.type) {
    case REDUX_ACTIONS.SET_TOAST:
      return {
        ...state,
        toastProps: action.props || {},
      };
    case REDUX_ACTIONS.CLEAR_TOAST:
      return {
        ...state,
        toastProps: {},
      };
    case REDUX_ACTIONS.PUSH_PERMISSION:
      return {
        ...state,
        pushNotificationPermission: action.permission,
      };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    case REDUX_ACTIONS.TOGGLE_NOTIFICATION_REQUEST:{
      return {
        ...state,
        notificationsRequest: ! state.notificationsRequest,
      };
    }
    case REDUX_ACTIONS.SET_SCREEN: {
      return {
        ...state,
        currentScreen: {
          screen: action.screen || '',
          data: action.data || {},
        },
      };

      // return newState;
    }
    default:
      return state;
  }
}
