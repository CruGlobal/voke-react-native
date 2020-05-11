import { REDUX_ACTIONS } from '../constants';

const initialState = {
  pushNotificationPermission: '',
  notificationsRequest: false,
  toastProps: {},
};

export default function(state = initialState, action) {
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
    default:
      return state;
  }
}
