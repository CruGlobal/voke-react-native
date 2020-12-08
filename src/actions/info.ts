import { ThunkDispatch } from 'redux-thunk';
import { REDUX_ACTIONS } from 'utils/constants';

type Dispatch = ThunkDispatch<any, any, any>;

export function toastAction(text: string, length?: 'long' | 'short' | null) {
  return async (dispatch: Dispatch, getState: any) => {
    let timeout;
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
      description: 'Show message: ' + text + '. Called from toastAction()',
    });
  };
}

type setCurrentScreenProps = {
  screen: string;
  data: object;
};
export function setCurrentScreen({ screen, data }: setCurrentScreenProps) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.SET_SCREEN,
      screen: screen,
      data: data ? data : null,
      description:
        'Set current screen: ' + screen + '. Called from setCurrentScreen()',
    });
  };
}

export function next() {
  return {};
}

export function setComplain({ messageId, adventureId }) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.SET_COMPLAIN,
      props: { messageId, adventureId },
      description: 'Create complain',
    });
  };
}

export function remindToUpdate(date: string) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.SET_REMIND_TO_UPDATE,
      remindToUpdateOn: date,
      description: `RemindToUpdateOn value updated.
         Called from: actions > info > remindToUpdate()`,
    });
  };
}
