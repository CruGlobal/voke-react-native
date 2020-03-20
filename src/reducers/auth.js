import { REDUX_ACTIONS } from '../constants';

const initialState = {
  isLoggedIn: false,
  user: {},
  modalProps: {},
  hasSeenSubscription: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REDUX_ACTIONS.SHOW_MODAL:
      return { ...state, modalProps: action.modalProps || {} };
    case REDUX_ACTIONS.HIDE_MODAL:
      return { ...state, modalProps: {} };
    case REDUX_ACTIONS.LOGIN:
      return { ...state, user: action.user, isLoggedIn: true };
    case REDUX_ACTIONS.SET_USER:
      return { ...state, user: action.user };
    case REDUX_ACTIONS.HAS_SEEN_SUBSCRIPTION_MODAL:
      return { ...state, hasSeenSubscription: action.bool };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
