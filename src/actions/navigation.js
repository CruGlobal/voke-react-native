import { Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';


export function navigateAction(routeName, params = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({
      routeName,
      params,
      // action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
    }));
  };
}

export function resetAction(index = 0, actions) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index,
      actions: actions || [
        NavigationActions.navigate({ routeName: 'Home' }),
      ],
    }));
  };
}

export function resetHomeAction() {
  return (dispatch) => {
    dispatch(resetAction()); // Default to resetting Home
  };
}

export function resetLoginAction() {
  return (dispatch) => {
    dispatch(resetAction(0, [
      NavigationActions.navigate({ routeName: 'Login' }),
    ]));
  };
}

// export function backAction(key) {
//   return (dispatch) => {
//     dispatch(NavigationActions.back({
//       key: key || null,
//     }));
//   };
// }

export function setParamsAction(key, params = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.setParams({
      key,
      params,
    }));
  };
}
