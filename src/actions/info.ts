import { ThunkDispatch } from 'redux-thunk';
import { REDUX_ACTIONS } from '../constants';

type Dispatch = ThunkDispatch<any, any, any>;

export function toastAction(text: string, length?: 'long' | 'short' | null) {
  return async (dispatch: Dispatch, getState: any) => {
    let timeout = undefined;
    switch (length) {
      case 'long':
        timeout = 8000;
        break;
      case 'short':
        timeout = 1500;
        break;
      default:
        break;
    }
    dispatch({
      type: REDUX_ACTIONS.SET_TOAST,
      props: { text: text, timeout: timeout },
      description: 'Show message: ' + text + '. Called from toastAction()'
    });
  };
}

export function next() {
  return {};
}
