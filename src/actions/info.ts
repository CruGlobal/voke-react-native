import { REDUX_ACTIONS } from '../constants';
import { ThunkDispatch } from 'redux-thunk';

type Dispatch = ThunkDispatch<any, any, any>;

export function toastAction(text: string, length?: string) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.SET_TOAST,
      props: { text, timeout: length === 'long' ? 8000 : undefined },
    });
  };
}
