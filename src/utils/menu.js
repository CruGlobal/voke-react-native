import { Linking, Platform } from 'react-native';
import Communications from 'react-native-communications';

import { logoutAction } from '../actions/auth';
import CONSTANTS from '../constants';

// This is used by the android <MenuButton /> and the iOS <Menu />
export function navMenuOptions({ dispatch, navigatePush, navigateResetLogin } = {}) {
  return [
    {
      id: 'profile',
      name: 'Profile',
      onPress: () => navigatePush && navigatePush('voke.Profile'),
    },
    {
      id: 'invite',
      name: 'Invite Friend',
      onPress: () => navigatePush && navigatePush('voke.Contacts', {
        isInvite: true,
        onSelect: (c) => {
          LOG('Invite this person:', c);
          let phone = c.phone && c.phone[0] ? c.phone[0] : null;
          let message = 'Check out this awesome app! https://vokeapp.com';
          Communications.text(phone, message);
        },
      }),
    },
    {
      id: 'about',
      name: 'About',
      onPress: () => navigatePush && navigatePush('voke.About'),
    },
    {
      id: 'review',
      name: 'Write a Review',
      onPress: () => {
        let link;
        if (Platform.OS === 'ios') {
          link = CONSTANTS.IOS_STORE_LINK;
        } else if (Platform.OS === 'android') {
          link = CONSTANTS.ANDROID_STORE_LINK;
        }
        if (link) {
          Linking.canOpenURL(link).then((isSupported) => {
            isSupported && Linking.openURL(link);
          }, (err) => LOG('opening url', err));
        }
      },
    },
    {
      id: 'acknowledgements',
      name: 'Acknowledgements',
      onPress: () => navigatePush && navigatePush('voke.Acknowledgements'),
    },
    {
      id: 'help',
      name: 'Help',
      onPress: () => navigatePush && navigatePush('voke.Help'),
    },
    {
      id: 'signout',
      name: 'Sign Out',
      onPress: () => {
        dispatch && dispatch(logoutAction()).then(() => {
          navigateResetLogin && navigateResetLogin();
        });
      },
    },
  ];
}
