import {
  ToastAndroid,
  Platform,
  Clipboard,
  findNodeHandle,
  UIManager,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import {
  useNavigation,
  useNavigationParam,
  useFocusState,
  useNavigationEvents,
  useNavigationKey,
  useNavigationState,
  useFocusEffect,
} from '@react-navigation/native';
import { isFunction } from '.';

export const isAndroid = Platform.OS === 'android';

export const URL_SCHEME = 'tribl';

export const keyExtractorId = i => `${i.id}`;

export {
  useNavigation,
  useNavigationParam,
  useFocusState,
  useNavigationEvents,
  useNavigationKey,
  useNavigationState,
  useFocusEffect,
};

export function copyText(string) {
  Clipboard.setString(string);
  toast('Copied!');
}
export function toast(text, duration) {
  if (isAndroid) {
    const toastDuration =
      duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.show(text, toastDuration);
  }
}

// Actions should be array of [{ text: '', onPress: fn, destructive: Bool (iOS) }]
export function showMenu(actions, ref) {
  let filteredActions = actions.filter(a => a && a.text);
  const actionsText = filteredActions.map(a => a.text);
  const select = i => {
    if (filteredActions[i] && isFunction(filteredActions[i].onPress)) {
      filteredActions[i].onPress();
    }
  };

  if (isAndroid) {
    // Android menu
    const handleError = () => {};
    const handleItemPress = (e, i) => select(i);
    UIManager.showPopupMenu(
      findNodeHandle(ref),
      actionsText,
      handleError,
      handleItemPress,
    );
  } else {
    // iOS menu
    const options = actionsText.concat('Cancel');

    let destructiveButtonIndex = filteredActions.findIndex(o => o.destructive);
    if (destructiveButtonIndex < 0) {
      destructiveButtonIndex = undefined;
    }

    const params = {
      options,
      cancelButtonIndex: options.length - 1,
      destructiveButtonIndex,
    };

    ActionSheetIOS.showActionSheetWithOptions(params, btnIndex =>
      select(btnIndex),
    );
  }
}

const FB_ERRORS = {
  'auth/user-not-found': 'Invalid email or password. Please try again.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/wrong-password': 'The user or password is invalid.',
};
