import { REDUX_ACTIONS } from '../constants';

const initialState = {
  isLoggedIn: false,
  authToken: '',
  user: {},
  modalProps: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REDUX_ACTIONS.SHOW_MODAL:
      return { ...state, modalProps: action.modalProps || {} };
    case REDUX_ACTIONS.HIDE_MODAL:
      return { ...state, modalProps: {} };
    case REDUX_ACTIONS.LOGIN:
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
        authToken: action.user.access_token.access_token,
      };
    case REDUX_ACTIONS.SET_USER:
      return { ...state, user: action.user };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
