import { LOGIN, LOGOUT } from '../constants';
// import { resetLoginAction, resetHomeAction } from './navigation';

export function loginAction(token, user = {}) {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      token,
      user,
    });
    // dispatch(resetHomeAction());
  };
}

export function logoutAction() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    // dispatch(resetLoginAction());
  };
}
